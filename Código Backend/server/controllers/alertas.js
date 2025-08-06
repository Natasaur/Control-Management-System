const Asistencia = require("../models/asistencias");
const Alumno = require("../models/alumnos");
const DiasNoLaborables = require("../models/dias_no_laborables");
const moment = require('moment');

async function alertasPorRango(req, res) {
  try {
    const { fechaInicio, fechaFin, plantel } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Fecha inicio y fecha fin son requeridas" });
    }

    const inicio = moment(fechaInicio).startOf('day');
    const fin = moment(fechaFin).endOf('day');

    // Filtro por plantel (segunda letra del grupo)
    let filtroAlumnos = {};
    if (plantel) {
      filtroAlumnos.grupo = { $regex: `^.${plantel}` };
    }

    const alumnos = await Alumno.find(filtroAlumnos).select(
      "matricula nombre apellido_paterno apellido_materno grupo contacto"
    );

    const totalDias = fin.diff(inicio, 'days') + 1;

    // Generar todas las fechas hábiles (lunes a viernes)
    let fechasEsperadas = [];
    for (let i = 0; i < totalDias; i++) {
      const fecha = moment(inicio).add(i, 'days');
      const dia = fecha.day(); // 0 = domingo, 6 = sábado
      if (dia >= 1 && dia <= 5) {
        fechasEsperadas.push(fecha.format("YYYY-MM-DD"));
      }
    }

    // Excluir días no laborables registrados
    const diasNoLaborables = await DiasNoLaborables.find({
      fecha: {
        $gte: inicio.toDate(),
        $lte: fin.toDate()
      }
    });

    const fechasNoLaborables = diasNoLaborables.map(d => moment(d.fecha).format("YYYY-MM-DD"));

    fechasEsperadas = fechasEsperadas.filter(f => !fechasNoLaborables.includes(f));

    // Obtener asistencias registradas en el rango
    const asistencias = await Asistencia.find({
      matricula: { $in: alumnos.map(a => a.matricula) },
      fecha: { $gte: inicio.toDate(), $lte: fin.toDate() }
    });

    // Agrupar por alumno
    const asistenciasPorAlumno = {};
    asistencias.forEach(a => {
      const fechaStr = moment(a.fecha).format("YYYY-MM-DD");
      if (!asistenciasPorAlumno[a.matricula]) {
        asistenciasPorAlumno[a.matricula] = new Set();
      }
      asistenciasPorAlumno[a.matricula].add(fechaStr);
    });

    // Generar alertas
    const alertas = alumnos.map(alumno => {
      const asistidas = asistenciasPorAlumno[alumno.matricula] || new Set();
      const fechasFaltantes = fechasEsperadas.filter(f => !asistidas.has(f));
      const numeroFaltas = fechasFaltantes.length;

      if (numeroFaltas >= 3) {
        return {
          matricula: alumno.matricula,
          nombre: alumno.nombre,
          apellido_paterno: alumno.apellido_paterno,
          apellido_materno: alumno.apellido_materno,
          grupo: alumno.grupo,
          contacto: alumno.contacto || "",
          numero_faltas: numeroFaltas,
          fechas_faltantes: fechasFaltantes
        };
      }
      return null;
    }).filter(Boolean);

    return res.status(200).json(alertas);
  } catch (error) {
    console.error("Error en alertasPorRango:", error);
    return res.status(500).json({ message: "Error al obtener alertas" });
  }
}

module.exports = { alertasPorRango };
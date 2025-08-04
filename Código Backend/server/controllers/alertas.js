const Asistencia = require("../models/asistencias");
const Alumno = require("../models/alumnos");

async function alertasPorRango(req, res) {
  try {
    const { fechaInicio, fechaFin, plantel } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Fecha inicio y fecha fin son requeridas" });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Filtro para alumnos según plantel (segunda letra del grupo)
    let filtroAlumnos = {};
    if (plantel) {
      filtroAlumnos.grupo = { $regex: `^.${plantel}` };
    }

    // Seleccionar solo campos necesarios (incluyendo apellidos y contacto)
    const alumnos = await Alumno.find(filtroAlumnos).select(
      "matricula nombre apellido_paterno apellido_materno grupo contacto"
    );

    // Generar array con todas las fechas entre inicio y fin (string YYYY-MM-DD)
    const diasTotales = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
    const fechasEsperadas = Array.from({ length: diasTotales }, (_, i) => {
      const fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + i);
      return fecha.toISOString().split("T")[0];
    });

    // Obtener asistencias dentro del rango para las matrículas filtradas
    const asistencias = await Asistencia.find({
      matricula: { $in: alumnos.map(a => a.matricula) },
      fecha: { $gte: inicio, $lte: fin }
    });

    // Agrupar las fechas en que el alumno asistió
    const asistenciasPorAlumno = {};
    asistencias.forEach(a => {
      const fechaStr = a.fecha.toISOString().split("T")[0];
      if (!asistenciasPorAlumno[a.matricula]) {
        asistenciasPorAlumno[a.matricula] = new Set();
      }
      asistenciasPorAlumno[a.matricula].add(fechaStr);
    });

    // Construir alertas: alumnos con 3 o más faltas (fechas esperadas - fechas asistidas)
    const alertas = alumnos.map(alumno => {
      const fechasAsistidas = asistenciasPorAlumno[alumno.matricula] || new Set();
      const fechasFaltantes = fechasEsperadas.filter(f => !fechasAsistidas.has(f));
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
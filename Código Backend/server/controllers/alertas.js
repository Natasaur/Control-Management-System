// Importación de los modelos necesarios
const Alertas = require("../models/alertas");
const Fechas_asistencias = require("../models/fechas_asistencias");
const Asistencia = require("../models/asistencias");
const Alumno = require("../models/alumnos");

// Función principal para generar alertas de asistencia por plantel
async function alertaPlantel(req, res) {
  // Se obtienen los datos del cuerpo de la petición
  const { semana, plantel } = req.body;

  // Se buscan todas las fechas de asistencia correspondientes a la semana dada
  const fechas = await Fechas_asistencias.find({ semana });
  const fechasLargo = fechas.length;
  const arrayFechas = [];

  // Se extraen únicamente las fechas en un arreglo
  for (let i = 0; i < fechasLargo; i++) {
    arrayFechas.push(fechas[i].fecha);
  }

  // Se obtienen todos los alumnos
  const alumnos = await Alumno.find();
  let alumnosPlantel = [];     // Alumnos que pertenecen al plantel indicado
  let alumnosMatricula = [];   // Matrículas de los alumnos del plantel

  // Se filtran los alumnos que pertenecen al plantel especificado
  for (let j = 0; j < alumnos.length; j++) {
    switch (alumnos[j].grupo[1]) {
      case plantel:
        alumnosPlantel.push(alumnos[j]);
        alumnosMatricula.push(alumnos[j].matricula);
        break;
    }
  }

  // Se buscan las asistencias de los alumnos del plantel en las fechas de la semana
  const asistenciasAlumnos = await Asistencia.find({
    matricula: { $in: alumnosMatricula },
    fecha: { $in: arrayFechas },
  });

  // Se asignan las fechas asistidas a cada alumno
  for (let k = 0; k < alumnosPlantel.length; k++) {
    for (let l = 0; l < asistenciasAlumnos.length; l++) {
      if (alumnosPlantel[k].matricula === asistenciasAlumnos[l].matricula) {
        alumnosPlantel[k].asistencias.push(asistenciasAlumnos[l].fecha);
      }
    }
  }

  const alertas = [];

  // Se genera una alerta si el alumno faltó más de una vez en la semana
  for (let m = 0; m < alumnosPlantel.length; m++) {
    if (fechasLargo - alumnosPlantel[m].asistencias.length > 1) {
      let alerta = {
        matricula: alumnosPlantel[m].matricula,
        nombre: alumnosPlantel[m].nombre,
        apellido_paterno: alumnosPlantel[m].apellido_paterno,
        apellido_materno: alumnosPlantel[m].apellido_materno,
        grupo: alumnosPlantel[m].grupo,
        contacto: alumnosPlantel[m].contacto,
        semana,
        fechas_asistencias: arrayFechas,
        fechas_asistidas: alumnosPlantel[m].asistencias,
      };

      alertas.push(alerta);
    }
  }

  // Se envían las alertas como respuesta
  res.status(200).send(alertas);
}

// Exportación de la función para su uso en otros archivos
module.exports = {
  alertaPlantel,
};

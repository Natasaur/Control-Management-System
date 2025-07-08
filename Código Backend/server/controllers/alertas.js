const Alertas = require("../models/alertas");
const Fechas_asistencias = require("../models/fechas_asistencias");
const Asistencia = require("../models/asistencias");
const Alumno = require("../models/alumnos");

async function alertaPlantel(req, res) {
  const { semana, plantel } = req.body;

  const fechas = await Fechas_asistencias.find({ semana });
  const fechasLargo = fechas.length;
  const arrayFechas = [];

  for (let i = 0; i < fechasLargo; i++) {
    arrayFechas.push(fechas[i].fecha);
  }

  const alumnos = await Alumno.find();
  let alumnosPlantel = [];
  let alumnosMatricula = [];

  for (let j = 0; j < alumnos.length; j++) {
    switch (alumnos[j].grupo[1]) {
      case plantel:
        alumnosPlantel.push(alumnos[j]);
        alumnosMatricula.push(alumnos[j].matricula);
        break;
    }
  }

  const asistenciasAlumnos = await Asistencia.find({
    matricula: { $in: alumnosMatricula },
    fecha: { $in: arrayFechas },
  });

  for (let k = 0; k < alumnosPlantel.length; k++) {
    for (let l = 0; l < asistenciasAlumnos.length; l++) {
      if (alumnosPlantel[k].matricula === asistenciasAlumnos[l].matricula) {
        alumnosPlantel[k].asistencias.push(asistenciasAlumnos[l].fecha);
      }
    }
  }

  const alertas = [];

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

  res.status(200).send(alertas);
}

module.exports = {
  alertaPlantel,
};
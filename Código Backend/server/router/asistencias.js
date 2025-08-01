const express = require("express");
const asistenciasController = require("../controllers/asistencias");
//const { authConsultor, authUsuario } = require("../middleware/auth");
const { authAdmin } = require("../middleware/auth");

const api = express.Router();

api.post(
  "/asistencia/crear/individual",
  //[authConsultor],
  [authAdmin],
  asistenciasController.crearAsistenciaIndividual
);
api.post(
  "/asistencia/crear/lista",
  //[authConsultor],
  [authAdmin],
  asistenciasController.crearListaAsistencias
);
api.delete(
  "/asistencia/eliminar",
  //[authConsultor],
  [authAdmin],
  asistenciasController.eliminarAsistencia
);
api.post(
  "/asistencia/buscar",
  //[authConsultor],
  [authAdmin],
  asistenciasController.obtenerAsistencia
);
api.post(
  "/asistencia/buscar/porcentaje/plantel",
  //[authUsuario],
  [authAdmin],
  asistenciasController.porcentajeAsistenciaPlantel
);
api.post(
  "/asistencia/buscar/porcentaje/cuatrimestre",
  //[authUsuario],
  [authAdmin],
  asistenciasController.porcentajeAsistenciaCuatrimestre
);
api.post(
  "/asistencia/buscar/porcentaje/carrera",
  //[authUsuario],
  [authAdmin],
  asistenciasController.porcentajeAsistenciaCarrera
);
api.post(
  "/asistencia/buscar/porcentaje/turno",
  //[authUsuario],
  [authAdmin],
  asistenciasController.porcentajeAsistenciaTurno
);
api.post(
  "/asistencia/buscar/porcentaje/grupo",
  //[authUsuario],
  [authAdmin],
  asistenciasController.porcentajeAsistenciaGrupo
);
api.post(
  "/asistencia/buscar/porcentaje/alumno",
  //[authUsuario],
  [authAdmin],
  asistenciasController.porcentajeAsistenciaAlumno
);

api.post(
  "/asistencia/buscar/resumen/grupo",
  [authAdmin],
  asistenciasController.resumenAsistenciasPorGrupo
);

api.post(
  "/asistencia/buscar/alumnos/con-faltas",
  [authAdmin],
  asistenciasController.alumnosConFaltas
);

api.post("/asistencia/buscar/porcentaje/diario",
  [authAdmin],
  asistenciasController.porcentajeAsistenciaDiario
);
api.post(
  "/asistencia/contarAsistenciaPorDia",
  [authAdmin],
  asistenciasController.contarAsistenciaPorDia
);
api.post(
  "/asistencia/contarFaltasPorAlumno",
  [authAdmin],
  asistenciasController.contarFaltasPorAlumno
);


module.exports = api;
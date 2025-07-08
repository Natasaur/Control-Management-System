const express = require("express");
const alumnosController = require("../controllers/alumnos");
/*const {
  authAdminAP,
  authAdminConsultorUsuario,
} = require("../middleware/auth");*/
const { authAdmin } = require("../middleware/auth");

const api = express.Router();

api.post(
  "/alumno/crear/individual",
  //[authAdminAP],
  [authAdmin],
  alumnosController.crearAlumnoIndividual
);
api.post(
  "/alumno/crear/lista",
  //[authAdminAP],
  [authAdmin],
  alumnosController.crearListaAlumnos
);
api.delete("/alumno/eliminar", 
  //[authAdminAP], 
  [authAdmin],
  alumnosController.borrarAlumno);
api.patch(
  "/alumno/actualizar",
  //[authAdminAP],
  [authAdmin],
  alumnosController.actualizarAlumno
);
api.get(
  "/alumno/todos",
  //[authAdminConsultorUsuario],
  [authAdmin],
  alumnosController.obtenerAlumnos
);
api.get(
  "/alumno/matricula",
  //[authAdminAP],
  [authAdmin],
  alumnosController.obtenerUnicoAlumno
);

module.exports = api;
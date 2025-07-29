const express = require("express");
const alumnosController = require("../controllers/alumnos");
const { authAdmin } = require("../middleware/auth");
const multer = require("multer");

const storage = multer.memoryStorage(); // para no guardar en disco
const upload = multer({ storage });

const api = express.Router();

api.post(
  "/alumno/crear/individual",
  upload.single("imagen"),
  [authAdmin],
  alumnosController.crearAlumnoIndividual
);
api.post(
  "/alumno/crear/lista",
  [authAdmin],
  alumnosController.crearListaAlumnos
);
api.delete(
  "/alumno/eliminar/:matricula",
  [authAdmin],
  alumnosController.borrarAlumno
);
api.patch(
  "/alumno/actualizar",
  [authAdmin],
  alumnosController.actualizarAlumno
);
api.get(
  "/alumno/todos",
  [authAdmin],
  alumnosController.obtenerAlumnos
);
api.get(
  "/alumno/:matricula",
  [authAdmin],
  alumnosController.obtenerUnicoAlumno
);
api.post(
  "/alumno/contarAsistenciaPorPlantel",
  //[authAdmin],
  alumnosController.contarAlumnosPorPlantel
);

module.exports = api;

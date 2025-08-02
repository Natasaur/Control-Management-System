const express = require("express");
const fechasController = require("../controllers/fechas_asistencias");
//const { authAdminAP } = require("../middleware/auth");
const { authAdmin } = require("../middleware/auth");

const api = express.Router();

api.post("/fecha/crear", 
   //[authAdminAP],
   //[authAdmin],
   fechasController.crearFechas);
api.get("/fecha/buscar", 
   //[authAdminAP], 
   //[authAdmin],
   fechasController.obtenerFechas);
api.delete("/fecha/eliminar", 
   //[authAdminAP], 
   //[authAdmin],
   fechasController.eliminarFechas);

module.exports = api;
const express = require("express");
const alertasController = require("../controllers/alertas");
//const { authUsuario } = require("../middleware/auth");
const { authAdmin } = require("../middleware/auth");

const api = express.Router();

api.post("/alertas/plantel", 
   //[authUsuario], 
   //[authAdmin],
   alertasController.alertaPlantel);
api.post("/alertas/plantel", 
   //[authAdmin], 
   alertasController.alertaPlantel);

module.exports = api;
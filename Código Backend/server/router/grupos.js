const express = require("express");
const gruposController = require("../controllers/grupos");
//const { authAdminAP, authConsultor, authAdminConsultorUsuario } = require("../middleware/auth");
const { authAdmin } = require("../middleware/auth");

const api = express.Router();

api.post(
  "/grupo/crear/individual",
  //[authAdminAP],
  [authAdmin],
  gruposController.crearGrupoIndividual
);
api.post("/grupo/crear/lista", 
  //[authAdminAP], 
  [authAdmin],
  gruposController.crearListaGrupo);
api.delete("/grupo/eliminar", 
  //[authAdminAP], 
  [authAdmin],
  gruposController.eliminarGrupo);
api.patch("/grupo/activar", 
  //[authAdminAP], 
  [authAdmin],
  gruposController.activarGrupo);
api.patch("/grupo/desactivar", 
  //[authAdminAP], 
  [authAdmin],
  gruposController.desactivarGrupo);
api.get("/grupo/buscar", 
  //[authAdminConsultorUsuario], 
  [authAdmin],
  gruposController.obtenerGrupos);
api.post("/grupo/buscar/activos", 
  //[authConsultor], 
  [authAdmin],
  gruposController.gruposActivos);
api.patch("/grupo/editar", 
  //[authAdminAP], 
  [authAdmin],
  gruposController.editarGrupo);

module.exports = api;
const express = require("express");
const usuariosController = require("../controllers/usuarios");
/*const {
  authAdminAP,
  authAdminConsultor,
  authAdminConsultorUsuario,
} = require("../middleware/auth");*/
const { authAdmin } = require("../middleware/auth");

const api = express.Router();

api.post(
  "/usuario/crear/individual",
  //[authAdminAP],
  [authAdmin],
  usuariosController.crearUsuarioIndividual
);
api.post(
  "/usuario/crear/lista",
  //[authAdminAP],
  [authAdmin],
  usuariosController.crearListaUsuario
);
api.delete(
  "/usuario/eliminar",
  //[authAdminAP],
  [authAdmin],
  usuariosController.borrarUsuario
);
api.patch(
  "/usuario/actualizar",
  //[authAdminConsultorUsuario],
  [authAdmin],
  usuariosController.actualizarUsuario
);
api.get(
  "/usuario/buscar/usuario",
  //[authAdminAP],
  [authAdmin],
  usuariosController.obtenerUsuarios
);
api.get(
  "/usuario/buscar/consultor",
  //[authAdminAP],
  [authAdmin],
  usuariosController.obtenerConsultores
);
api.get(
  "/usuario/buscar/administradorapoyo",
  //[authAdminAP],
  [authAdmin],
  usuariosController.obtenerAdministradoresApoyo
);
api.get(
  "/usuario/buscar/administrador",
  //[authAdminAP],
  [authAdmin],
  usuariosController.obtenerAdministrador
);
api.post(
  "/usuario/buscar/matricula",
  //[authAdminAP],
  [authAdmin],
  usuariosController.obtenerUnicoUsuario
);
api.patch(
  "/usuario/agregargrupo",
  //[authAdminConsultor],
  [authAdmin],
  usuariosController.agregarGrupo
);
api.patch(
  "/usuario/quitargrupo",
  //[authAdminConsultor],
  [authAdmin],
  usuariosController.quitarGrupo
);
api.patch("/usuario/correo/reenviar", usuariosController.reenviarCorreo);

module.exports = api;
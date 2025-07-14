const express = require("express");
const carrerasController = require("../controllers/carreras");
const { authAdmin } = require("../middleware/auth");

const api = express.Router();

api.get(
  "/carrera/obtenerCarreras",
  //[authAdmin],
  carrerasController.obtenerCarreras,
);

module.exports = api;
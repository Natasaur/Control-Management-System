const express = require("express");
const alertasController = require("../controllers/alertas");

const api = express.Router();

api.post("/alertas/plantel", alertasController.alertasPorRango);

module.exports = api;
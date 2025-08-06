const express = require("express");
const dias_no_laborablesController = require("../controllers/dias_no_laborables");
const api = express.Router();

api.post("/diasnolaborables/crearDia", dias_no_laborablesController.crearDiaNoLaborable);
api.post("/diasnolaborables/obtenerDias", dias_no_laborablesController.obtenerDiasNoLaborables);

module.exports = api;
const express = require("express");
const plantelesController = require("../controllers/planteles");
const { authAdmin } = require("../middleware/auth");

const api = express.Router();

api.get(
  "/plantel/obtenerPlanteles",
  //[authAdmin],
  plantelesController.obtenerPlanteles,
);

module.exports = api;
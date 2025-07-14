// controllers/carreras.js

const Carrera = require("../models/carreras");

async function obtenerCarreras(req, res) {
  try {
    const carreras = await Carrera.find().sort({ nombre: 1 });
    res.status(200).json(carreras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las carreras" });
  }
}

module.exports = {
   obtenerCarreras,
};
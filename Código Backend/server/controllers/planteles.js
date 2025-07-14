// controllers/planteles.js

const Plantel = require("../models/planteles");

async function obtenerPlanteles(req, res) {
  try {
    const planteles = await Plantel.find().sort({ nombre: 1 });
    res.status(200).json(planteles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los planteles" });
  }
}

module.exports = {
   obtenerPlanteles,
};
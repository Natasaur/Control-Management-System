// controllers/planteles.js

const Plantel = require("../models/planteles");

// FUNCION PARA OBTENER TODOS LOS PLANTELES ORDENADOS ALFABETICAMENTE POR NOMBRE
async function obtenerPlanteles(req, res) {
  try {
    // Buscar todos los planteles y ordenarlos por nombre ascendente
    const planteles = await Plantel.find().sort({ nombre: 1 });
    // Enviar la lista de planteles como respuesta JSON
    res.status(200).json(planteles);
  } catch (error) {
    // En caso de error, mostrarlo en consola y enviar respuesta con error 500
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los planteles" });
  }
}

module.exports = {
   obtenerPlanteles,
};
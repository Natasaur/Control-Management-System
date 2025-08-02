// Importa el modelo de carreras para consultar la base de datos
const Carrera = require("../models/carreras");

// Función asíncrona para obtener todas las carreras
async function obtenerCarreras(req, res) {
  try {
    // Busca todas las carreras y las ordena alfabéticamente por el campo "nombre"
    const carreras = await Carrera.find().sort({ nombre: 1 });
    
    // Envía la lista de carreras con código 200 (OK)
    res.status(200).json(carreras);
  } catch (error) {
    // En caso de error, lo muestra en consola para debug
    console.error(error);
    
    // Envía una respuesta con error 500 y un mensaje descriptivo
    res.status(500).json({ msg: "Error al obtener las carreras" });
  }
}

// Exporta la función para que pueda usarse en las rutas
module.exports = {
  obtenerCarreras,
};
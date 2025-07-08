const Fechas_asistencias = require("../models/fechas_asistencias");

//ADMINISTRADOR
//FUNCION PARA CARGAR EL ARRAY CON LA LISTA DE FECHAS PARA ASISTENCIA
//SE ESPERA QUE NO SE HAGAN CAMBIOS EN LAS FECHAS SELECCIONADAS, PERO DE SER ASI, EL ADMIN DEBE DE SELECCIONAR LAS FECHAS QUE CARGARA Y EN EL BACKEND SE BORRARA TODAS LAS FECHAS QUE SE HABIAN GUARDADO
//Y SE CARGARAN LAS NUEVAS FECHAS SELECCIONADAS
async function crearFechas(req, res) {
  const arrayFechas = req.body;

  try {
    const fechasCreadas = await Fechas_asistencias.insertMany(arrayFechas);

    res.status(200).send(fechasCreadas);
  } catch (error) {
    res.status(400).send({ msg: "Error al cargar las fechas" });
    throw error;
  }
}

//ADMINISTRADOR
//FUNCION PARA OBTENER LAS FECHAS GUARDADAS Y MOSTRARLAS EN UNA TABLA O EN EL CALENDARIO
async function obtenerFechas(req, res) {
  const response = await Fechas_asistencias.find();

  if (!response) {
    res.status(400).send({ msg: "Error al obtener las fechas de asistencias" });
  } else {
    res.status(200).send(response);
  }
}

//ADMINISTRADOR
//EN CASO DE QUE SE DESEE CAMBIAR LAS FECHAS YA CARGADAS, EL ADMIN DEBE DE VOLVER A SELECCIONAR TODAS LAS FECHAS NUEVAMENTE, PARA EVITAR DUPLICADOS, PRIMERO SE BORRARAN LAS FECHAS YA GUARDADAS
//PARA GUARDAR LAS NUEVAS FECHAS SELECCIONADAS
async function eliminarFechas(req, res) {
  try {
    const fechasEliminadas = await Fechas_asistencias.deleteMany();

    if (!fechasEliminadas) {
      res.status(400).send({ msg: "Error al eliminar fechas" });
    } else {
      res.status(200).send({ msg: "Fechas eliminadas" });
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  crearFechas,
  obtenerFechas,
  eliminarFechas,
};
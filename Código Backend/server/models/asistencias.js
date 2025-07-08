const mongoose = require("mongoose");

const asistenciasSchema = new mongoose.Schema({
  matricula: String,
  grupo: String,
  ciclo_escolar: String,
  fecha: String,
  tipo_asistencia: String,
});

module.exports = mongoose.model("asistencias", asistenciasSchema);
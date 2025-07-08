const mongoose = require("mongoose");

const alertasSchema = new mongoose.Schema({
  matricula: String,
  nombre: String,
  apellido_paterno: String,
  apellido_materno: String,
  grupo: String,
  contacto: String,
  semana: Number,
  fechas_asistencias: [],
  fechas_asistidas: [],
  numero_faltas: Number,
});

module.exports = mongoose.model("alertas", alertasSchema);
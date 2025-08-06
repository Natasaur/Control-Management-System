const mongoose = require("mongoose");

const alertasSchema = new mongoose.Schema({
  matricula: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido_paterno: { type: String, required: true },
  apellido_materno: { type: String, required: true },
  grupo: { type: String, required: true },
  contacto: { type: String, default: "" },
  fechas_asistencias: [String], // Fechas esperadas (YYYY-MM-DD)
  fechas_asistidas: [String],   // Fechas en las que sí asistió
  numero_faltas: { type: Number, required: true },
  fecha_inicio: Date,
  fecha_fin: Date,
  generado_en: { type: Date, default: Date.now }
});

module.exports = mongoose.model("alertas", alertasSchema);
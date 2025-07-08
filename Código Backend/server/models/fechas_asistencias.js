const mongoose = require("mongoose");

const fechasSchema = new mongoose.Schema({
  fecha: {
    type: String,
    unique: true,
  },
  semana: Number,
  modalidad: String,
});

module.exports = mongoose.model("fechas_asistencias", fechasSchema);
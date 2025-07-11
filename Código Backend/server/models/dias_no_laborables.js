const mongoose = require("mongoose");

const DiasNoLaborablesSchema = new mongoose.Schema({
  fecha: { type: String, required: true }, // ej. "10/06/2025"
  motivo: String
});

module.exports = mongoose.model("DiasNoLaborables", DiasNoLaborablesSchema);
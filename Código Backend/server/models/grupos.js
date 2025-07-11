const mongoose = require("mongoose");

const gruposSchema = new mongoose.Schema({
  grupo: {
    unique: true,
    type: String,
    required: true,
  },
  plantel: {
    type: String,
    required: true,
  },
  carrera: {
    type: String,
    required: true,
  },
  turno: {
    type: String,
    enum: ["M", "V", "N"], // M = matutino, V = vespertino, N = nocturno
    required: true,
  },
  disponible: {
    type: Boolean,
    default: true,
    required: true,
  },
});

module.exports = mongoose.model("grupos", gruposSchema);
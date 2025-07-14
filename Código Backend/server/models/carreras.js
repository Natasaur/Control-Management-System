const mongoose = require("mongoose");

const carrerasSchema = new mongoose.Schema({
  clave: {
    unique: true,
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("carreras", carrerasSchema);
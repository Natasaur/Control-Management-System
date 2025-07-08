const mongoose = require("mongoose");

const usuariosSchema = new mongoose.Schema({
  matricula: {
    unique: true,
    type: String,
  },
  nombre: String,
  apellido_paterno: String,
  apellido_materno: String,
  plantel: String,
  correo: {
    unique: true,
    type: String,
  },
  password: String,
  rol: String,
  grupos: [],
});

module.exports = mongoose.model("usuarios", usuariosSchema);
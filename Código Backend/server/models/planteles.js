const mongoose = require("mongoose");

const plantelesSchema = new mongoose.Schema({
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

module.exports = mongoose.model("planteles", plantelesSchema);
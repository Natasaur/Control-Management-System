const mongoose = require("mongoose");

const gruposSchema = new mongoose.Schema({
  grupo: {
    unique: true,
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("grupos", gruposSchema);
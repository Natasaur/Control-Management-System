const mongoose = require("mongoose");

const diasNoLaborablesSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true,
    unique: true
  },
  motivo: {
    type: String,
    required: true
  },
  modalidad: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("dias_no_laborables", diasNoLaborablesSchema);

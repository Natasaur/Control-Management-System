const mongoose = require('mongoose');

const AsistenciaSchema = new mongoose.Schema({
  matricula: {
    type: String,
    required: true,
  },
  grupo: {
    type: String,
    required: true,
  },
  ciclo_escolar: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date, // Importante: debe ser tipo Date
    required: true,
  },
  tipo_asistencia: {
    type: String,
    required: true,
  },
}, { collection: 'asistencias' }); // Asegura usar la colección correcta

module.exports = mongoose.model('Asistencia', AsistenciaSchema);
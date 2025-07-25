const mongoose = require("mongoose");

const alumnosSchema = new mongoose.Schema({
	matricula: {
		unique: true,
		type: String,
	},
	nombre: String,
	apellido_paterno: String,
	apellido_materno: String,
	grupo: String,
	ciclo_escolar: String,
	contacto: {
		unique: true,
		type: String,
	},
	asistencias: [],
	encoding: {
		type: [Number], // o Array si no usas Mongoose estrictamente
		required: true
	},
});

module.exports = mongoose.model("alumnos", alumnosSchema);
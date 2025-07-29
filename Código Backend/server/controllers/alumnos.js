const Alumno = require("../models/alumnos");
const Plantel = require("../models/planteles");
const Asistencia = require("../models/asistencias");
const moment = require("moment");
const axios = require("axios");
const FormData = require("form-data");

// ADMINISTRADOR - Crear alumno individual
async function crearAlumnoIndividual(req, res) {
  const {
    matricula,
    nombre,
    apellido_paterno,
    apellido_materno,
    grupo,
    ciclo_escolar,
    contacto,
  } = req.body;

  if (!matricula) return res.status(400).send({ msg: "Matricula es requerida" });
  if (!nombre) return res.status(400).send({ msg: "Nombre es requerido" });
  if (!grupo) return res.status(400).send({ msg: "Grupo es requerido" });
  if (!ciclo_escolar) return res.status(400).send({ msg: "Ciclo escolar es requerido" });
  if (!contacto) return res.status(400).send({ msg: "Contacto es requerido" });

  if (!req.file) {
    return res.status(400).send({ msg: "Imagen es requerida"});
  }

  try {
    const formData = new FormData();
    formData.append("imagen",req.file.buffer, {
      filename: req.file.originalname,
      constentType: req.file.mimetype,
    });

    const djangoResponse = await axios.post("http://127.0.0.1:8000/api/encoding/", formData, {
      headers: formData.getHeaders(),
    });

    const encoding = djangoResponse.data.encoding;

    const alumno = new Alumno({
      matricula,
      nombre,
      apellido_paterno,
      apellido_materno,
      grupo,
      ciclo_escolar,
      contacto,
      encoding,
    });

    const userStorage = await alumno.save();
    res.status(201).send(userStorage);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al crear el alumno" });
  }
}

// ADMINISTRADOR - Crear lista de alumnos
async function crearListaAlumnos(req, res) {
  const alumnosArray = req.body;

  try {
    const alumnosCreados = await Alumno.insertMany(alumnosArray);
    res.status(201).send({
      msg: "Éxito al cargar la lista de alumnos",
      alumnosCreados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al cargar la lista de alumnos" });
  }
}

// ADMINISTRADOR - Eliminar alumno
async function borrarAlumno(req, res) {
  const { matricula } = req.params;

  try {
    const alumnoEliminado = await Alumno.findOneAndDelete({ matricula });

    if (!alumnoEliminado) {
      res.status(404).send({ msg: "Alumno no encontrado" });
    } else {
      res.status(200).send({ msg: "Alumno eliminado correctamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al eliminar alumno" });
  }
}

// ADMINISTRADOR - Actualizar alumno
async function actualizarAlumno(req, res) {
  const {
    matricula,
    nombre,
    apellido_paterno,
    apellido_materno,
    grupo,
    ciclo_escolar,
    contacto,
  } = req.body;

  try {
    const alumnoActualizado = await Alumno.findOneAndUpdate(
      { matricula },
      {
        $set: {
          matricula,
          nombre,
          apellido_paterno,
          apellido_materno,
          grupo,
          ciclo_escolar,
          contacto,
        },
      },
      { new: true }
    );

    if (!alumnoActualizado) {
      res.status(404).send({ msg: "Alumno no encontrado" });
    } else {
      res.status(200).send(alumnoActualizado);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al actualizar datos del alumno" });
  }
}

// ADMINISTRADOR - Obtener todos los alumnos
async function obtenerAlumnos(req, res) {
  try {
    const alumnos = await Alumno.find();

    res.status(200).send(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al obtener los alumnos" });
  }
}

// ADMINISTRADOR - Obtener un solo alumno por matrícula
async function obtenerUnicoAlumno(req, res) {
  const { matricula } = req.params;

  try {
    const alumno = await Alumno.findOne({ matricula });

    if (!alumno) {
      return res.status(404).send({ msg: "Alumno no encontrado" });
    }

    res.status(200).send(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al obtener los datos del alumno" });
  }
}

// ADMINISTRADOR - Contar alumnos por plantel
async function contarAlumnosPorPlantel(req, res) {
  try {
    const { plantel } = req.query;

    let planteles = [];

    if (plantel) {
      planteles = await Plantel.find({ clave: plantel });
    } else {
      planteles = await Plantel.find();
    }

    const alumnosPorPlantel = {};
    for (const p of planteles) {
      alumnosPorPlantel[p.clave] = {
        plantel: p.nombre,
        cantidadAlumnos: 0,
        alumnos: [],
      };
    }

    const alumnos = await Alumno.find();

    for (const alumno of alumnos) {
      const letraPlantel = alumno.grupo[1];
      if (alumnosPorPlantel[letraPlantel]) {
        alumnosPorPlantel[letraPlantel].cantidadAlumnos++;
        alumnosPorPlantel[letraPlantel].alumnos.push({
          matricula: alumno.matricula,
          grupo: alumno.grupo,
          nombre: alumno.nombre,
        });
      }
    }

    const respuesta = Object.values(alumnosPorPlantel);

    res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al contar alumnos por plantel:", error);
    res.status(500).json({ msg: "Error al contar alumnos por plantel" });
  }
}

module.exports = {
  crearAlumnoIndividual,
  crearListaAlumnos,
  actualizarAlumno,
  borrarAlumno,
  obtenerAlumnos,
  obtenerUnicoAlumno,
  contarAlumnosPorPlantel,
};

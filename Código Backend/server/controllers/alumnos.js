// Importación de modelos de base de datos y librerías necesarias
const Alumno = require("../models/alumnos");           // Modelo para los alumnos
const Plantel = require("../models/planteles");        // Modelo para los planteles escolares
const Asistencia = require("../models/asistencias");   // Modelo para las asistencias (aunque no se utiliza aquí)
const moment = require("moment");                      // Librería para manipulación de fechas (no se usa en este archivo)
const axios = require("axios");                        // Cliente HTTP para hacer solicitudes externas
const FormData = require("form-data");                 // Para enviar datos tipo formulario, útil para imágenes

// ADMINISTRADOR - Crear alumno individual
async function crearAlumnoIndividual(req, res) {
  // Extrae los datos del alumno desde el cuerpo de la solicitud
  const {
    matricula,
    nombre,
    apellido_paterno,
    apellido_materno,
    grupo,
    ciclo_escolar,
    contacto,
  } = req.body;

  // Validaciones para asegurar que los campos requeridos estén presentes
  if (!matricula) return res.status(400).send({ msg: "Matricula es requerida" });
  if (!nombre) return res.status(400).send({ msg: "Nombre es requerido" });
  if (!grupo) return res.status(400).send({ msg: "Grupo es requerido" });
  if (!ciclo_escolar) return res.status(400).send({ msg: "Ciclo escolar es requerido" });
  if (!contacto) return res.status(400).send({ msg: "Contacto es requerido" });

  // Verifica que se haya enviado una imagen
  if (!req.file) {
    return res.status(400).send({ msg: "Imagen es requerida"});
  }

  try {
    // Prepara los datos del formulario con la imagen
    const formData = new FormData();
    formData.append("imagen", req.file.buffer, {
      filename: req.file.originalname,
      constentType: req.file.mimetype, // Posible error tipográfico: debería ser "contentType"
    });

    // Envía la imagen al microservicio Django para obtener el encoding facial
    const djangoResponse = await axios.post("http://127.0.0.1:8000/api/encoding/", formData, {
      headers: formData.getHeaders(),
    });

    // Obtiene el encoding facial de la respuesta
    const encoding = djangoResponse.data.encoding;

    // Crea un nuevo alumno con los datos y el encoding
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

    // Guarda el alumno en la base de datos
    const userStorage = await alumno.save();
    res.status(201).send(userStorage);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al crear el alumno" });
  }
}

// ADMINISTRADOR - Crear lista de alumnos (carga masiva)
async function crearListaAlumnos(req, res) {
  const alumnosArray = req.body; // Arreglo con múltiples alumnos

  try {
    // Inserta todos los alumnos al mismo tiempo
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

// ADMINISTRADOR - Eliminar alumno por matrícula
async function borrarAlumno(req, res) {
  const { matricula } = req.params;

  try {
    // Busca y elimina el alumno con la matrícula especificada
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

// ADMINISTRADOR - Actualizar datos de un alumno
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
    // Busca al alumno por matrícula y actualiza los campos especificados
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
      { new: true } // Para devolver el documento actualizado
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
    const alumnos = await Alumno.find(); // Recupera todos los alumnos
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
    const alumno = await Alumno.findOne({ matricula }); // Busca alumno por matrícula

    if (!alumno) {
      return res.status(404).send({ msg: "Alumno no encontrado" });
    }

    res.status(200).send(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al obtener los datos del alumno" });
  }
}

// ADMINISTRADOR - Contar alumnos por plantel (basado en la letra del grupo)
async function contarAlumnosPorPlantel(req, res) {
  try {
    const { plantel } = req.query;

    let planteles = [];

    // Si se especifica un plantel, lo busca por clave; si no, obtiene todos
    if (plantel) {
      planteles = await Plantel.find({ clave: plantel });
    } else {
      planteles = await Plantel.find();
    }

    // Estructura para almacenar la información por plantel
    const alumnosPorPlantel = {};
    for (const p of planteles) {
      alumnosPorPlantel[p.clave] = {
        plantel: p.nombre,
        cantidadAlumnos: 0,
        alumnos: [],
      };
    }

    const alumnos = await Alumno.find(); // Obtiene todos los alumnos

    // Clasifica cada alumno en su plantel según la segunda letra del grupo (ej. "A1" → "1")
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

    // Convierte el objeto de resultados en un arreglo para responderlo
    const respuesta = Object.values(alumnosPorPlantel);

    res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al contar alumnos por plantel:", error);
    res.status(500).json({ msg: "Error al contar alumnos por plantel" });
  }
}

async function obtenerPorGrupo(req, res) {
    const { grupo } = req.body;
    try {
        const alumnos = await Alumno.find({ grupo });
        res.status(200).json(alumnos);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener alumnos por grupo", error: err });
    }
};

// Exporta todas las funciones para ser usadas en rutas u otros módulos
module.exports = {
  crearAlumnoIndividual,
  crearListaAlumnos,
  actualizarAlumno,
  borrarAlumno,
  obtenerAlumnos,
  obtenerUnicoAlumno,
  contarAlumnosPorPlantel,
  obtenerPorGrupo,
};

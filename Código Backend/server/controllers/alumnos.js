const Alumno = require("../models/alumnos");

//ADMINISTRADOR
//FUNCION PARA CARGAR UN SOLO ALUMNO, USO SUGERIDO EN UN FORMULARIO
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

  if (!matricula) res.status(400).send({ msg: "Matricula es requerido" });
  if (!nombre) res.status(400).send({ msg: "Nombre es requerido" });
  if (!grupo) res.status(400).send({ msg: "Grupo es requerido" });
  if (!ciclo_escolar)
    res.status(400).send({ msg: "Ciclo escolar es requerido" });
  if (!contacto) res.status(400).send({ msg: "Contacto es requerido" });

  const alumno = new Alumno({
    matricula,
    nombre,
    apellido_paterno,
    apellido_materno,
    grupo,
    ciclo_escolar,
    contacto,
  });

  await alumno.save((error, userStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el usuario" });
      console.log(error);
    } else {
      res.status(200).send(userStorage);
    }
  });
}

//ADMINISTRADOR
//FUNCION PARA CARGAR UNA LISTA DE ALUMNOS ENVIANDO UN ARRAY CON LOS OBJETOS JSON DENTRO
async function crearListaAlumnos(req, res) {
  const alumnosArray = req.body;

  try {
    const alumnosCreados = await Alumno.insertMany(alumnosArray);

    res
      .status(200)
      .send({ msg: "Exito al cargar la lista de alumnos ", alumnosCreados });
  } catch (error) {
    res.status(400).send({ msg: "Error al cargar la lista de alumnos" });
    throw error;
  }
}

//ADMINISTRADOR
//FUNCION PARA ELIMINAR UN ALUMNO ENVIANDO SU MATRICULA COMO ARGUMENTO
async function borrarAlumno(req, res) {
  const { matricula } = req.body;

  try {
    const alumnoEliminado = await Alumno.findOneAndDelete({ matricula });

    if (!alumnoEliminado) {
      res.status(400).send({ msg: "Error al eliminar alumno" });
    } else {
      res.status(200).send({ msg: "Alumno eliminado" });
    }
  } catch (error) {
    throw error;
  }
}

//ADMINISTRADOR
//FUNCION PARA ACTUALIZAR LOS DATOS DEL ALUMNO,LA MATRICULA TAMBIEN SE PUEDE ACTUALIZAR
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
      res.status(400).send({ msg: "Error al actualizar datos del alumno" });
    } else {
      res.status(200).send(alumnoActualizado);
    }
  } catch (error) {
    throw error;
  }
}

//ADMINISTRADOR
//FUNCION PARA OBTENER ABSOLUTAMENTE TODOS LOS ALUMNOS
async function obtenerAlumnos(req, res) {
  const response = await Alumno.find();

  if (!response) {
    res.status(400).send({ msg: "Error al obtener los alumnos" });
  } else {
    res.status(200).send(response);
  }
}

//ADMINISTRADOR
//FUNCION PARA OBTENER LOS DATOS DE UN SOLO ALUMNO PASANDO COMO ARGUMENTO SU MATRICULA
async function obtenerUnicoAlumno(req, res) {
  const { matricula } = req.body;

  const response = await Alumno.find({ matricula });

  if (!response) {
    res.status(400).send({ msg: "Error al obtener los datos del alumno" });
  } else {
    res.status(200).send(response);
  }
}

//USUARIOS: RECTOR
//TODO FUNCION PARA OBTENER LOS ALUMNOS CON PROBABILIDAD DE BAJA PARA LOS USUARIOS: RECTOR
//OPCION: POR CADA SEMANA SE EVALUE Y MUESTRE A AQUELLOS ALUMNOS QUE TENGAN AL MENOS DOS INASISTENCIAS, ESO SERIA CONSIDERADO UNA ALERTA

module.exports = {
  crearAlumnoIndividual,
  crearListaAlumnos,
  actualizarAlumno,
  borrarAlumno,
  obtenerAlumnos,
  obtenerUnicoAlumno,
};
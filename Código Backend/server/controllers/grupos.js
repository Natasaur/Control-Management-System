const Grupo = require("../models/grupos");

//ADMINISTRADOR
//FUNCION PARA CARGAR UN GRUPO DE MANERA INIDIVUAL, USO SUGERIDO EN UN FORMULARIO
async function crearGrupoIndividual(req, res) {
  const { grupo } = req.body;

  const grupos = new Grupos({ grupo });

  await grupos.save((error, userStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el grupo" });
      console.log(error);
    } else {
      res.status(200).send(userStorage);
    }
  });
}

//ADMINISTRADOR
//FUNCION PARA CARGAR UNA LISTA ARRAY QUE CONTENGA OBJETOS JSON CON EL PURO ATRIBUTO DEL GRUPO, POR DEFECTO LA DISPONIBILIDAD SE ESTABLECE EN TRUE
async function crearListaGrupo(req, res) {
  const gruposArray = req.body;

  try {
    const gruposCreados = await Grupos.insertMany(gruposArray);

    res
      .status(200)
      .send({ msg: "Exito al cargar la lista de grupos", gruposCreados });
  } catch (error) {
    res.status(400).send({ msg: "Error al cargar la lista de grupos" });
    throw error;
  }
}

//ADMINISTRADOR
//FUNCION PARA SELECCIONAR UN GRUPO Y ELIMINARLO
async function eliminarGrupo(req, res) {
  const { grupo } = req.body;

  try {
    const grupoEliminado = await Grupos.findOneAndDelete({ grupo });

    if (!grupoEliminado) {
      res.status(400).send({ msg: "Error al eliminar el grupo" });
    } else {
      res.status(200).send({ msg: "Grupo eliminado" });
    }
  } catch (error) {}
}

//ADMINISTRADOR / CONSULTOR
//FUNCION PARA ESTABLECER LA DISPONIBILIDAD EN TRUE. ESTE SIRVE PARA CUANDO SE DESASIGNA UN GRUPO A UN CONSULTOR. EL ARGUMENTO DE ENTRADA ES EL NOMBRE DEL GRUPO
//FUNCION PARA EL CONSULTOR
//NO USAR, ESTA FUNCION YA SE INCLUYE DENTRO DE LA FUNCION 'QUITARGRUPO' EN LOS CONTROLADORES DEL USUARIO
async function activarGrupo(req, res) {
  const { grupo } = req.body;

  try {
    const grupoActualizado = await Grupos.findOneAndUpdate(
      { grupo },
      { disponible: true },
      { new: true }
    );

    if (!grupoActualizado) {
      res
        .status(400)
        .send({ msg: "Error al activar el estado del grupo: ", grupo });
    } else {
      res.status(200).send(grupoActualizado);
    }
  } catch (error) {
    throw error;
  }
}

//ADMINISTRADOR / CONSULTOR
//FUNCION PARA ESTABLECER LA DISPONIBILIDAD DE UN GRUPO EN FALSE. SIRVE PARA CUANDO UN CONSULTOR SELECCIONA UN GRUPO, SELECCIONA GUARDAR Y AL MISMO TIEMPO QUE SE ASIGNAN ESOS GRUPOS A SUS ATRIBUTOS,
//LA DISPONIBILIDAD DEL GRUPO DEBE DE CAMBIAR. PIDE COMO ARGUMENTO DE ENTRADA EL NOMBRE DEL GRUPO. PARA GUARDAR VARIOS SE PUEDE HACER USO DE UN CICLO FOR O FOREACH YA QUE CADA GRUPO SE DEBE DE VALIDAR
//QUE ESTE DISPONIBLE EN CASO DE QUE DOS LO SELECCIONEN AL MISMO TIEMPO.
//EN CASO DE QUE FALLE Y NO SE DESACTIVE EL GRUPO, SE MANDA EN EL BODY DEL RESPONSE EL NOMBRE DEL GRUPO QUE NO SE PUDO DESACTIVAR
//FUNCION PARA EL CONSULTOR
//NO USAR, ESTA FUNCION YA SE INCLUYE DENTRO DE LA FUNCION 'AGREGARGRUPO' EN LOS CONTROLADORES DEL USUARIO
async function desactivarGrupo(req, res) {
  const { grupo } = req.body;

  try {
    const grupoActualizado = await Grupos.findOneAndUpdate(
      { grupo },
      { disponible: false },
      { new: true }
    );

    if (!grupoActualizado) {
      res
        .status(400)
        .send({ msg: "Error al desactivar el estado del grupo: ", grupo });
    } else {
      res.status(200).send(grupoActualizado);
    }
  } catch (error) {
    throw error;
  }
}

//ADMINISTRADOR
//FUNCION PARA OBTENER TODOS LOS GRUPOS REGISTRADOS
//FUNCION PARA EL ADMINISTRADOR
async function obtenerGrupos(req, res) {
  try {
    const response = await Grupos.find();
    res.status(200).send(response);
  } catch (error) {
    console.error("Error al buscar los grupos:", error);
    res.status(500).send({ msg: "Error del servidor al buscar los grupos" });
  }
}

//CONSULTOR
//FUNCION PARA BUSCAR LOS GRUPOS QUE ESTEN DISPONIBLES DE ACUERDO AL PLANTEL AL QUE PERTENEZCA EL CONSULTOR, ES POR ESO QUE EL UNICO ARGUMENTO DE ENTRADA ES EL PLANTEL
//SIRVE PARA LA TABLA MOSTRANDO LOS GRUPOS DISPONIBLES A ELEGIR
//FUNCION PARA EL CONSUTOR
async function gruposActivos(req, res) {
  const { plantel } = req.body;

  // Siempre filtra por disponible
  const filtro = { disponible: true };

  // Si se envía plantel y NO es "TODOS", filtramos por plantel
  if (plantel && plantel !== "TODOS") {
    filtro.plantel = plantel;
  }

  const grupos = await Grupo.find(filtro);

  if (grupos.length === 0) {
    return res.status(400).send({
      msg: "Error, no se encontraron grupos disponibles de acuerdo a la zona",
    });
  } else {
    return res.status(200).send(grupos);
  }
}

//ADMINISTRADOR
//FUNCION PARA EDITAR EL NOMBRE DE UN GRUPO. SE DEBE DE ENVIAR COMO PARAMETRO UN JSON CON DOS ATRIBUTOS, PRIMERO EL NOMBRE QUE TIENE ACTUALMENTE Y SEGUNDO EL NOMBRE AL QUE SE LE QUIERE CAMBIAR
async function editarGrupo(req, res) {
  const { grupo, nuevoGrupo } = req.body;

  const grupoActualizado = await Grupos.findOneAndUpdate(
    { grupo },
    {
      $set: {
        grupo: nuevoGrupo,
      },
    },
    { new: true }
  );

  if (!grupoActualizado) {
    res.status(400).send({ msg: "Error al actualizar nombre del grupo" });
  } else {
    res.status(200).send(grupoActualizado);
  }
}

module.exports = {
  crearGrupoIndividual,
  crearListaGrupo,
  eliminarGrupo,
  activarGrupo,
  desactivarGrupo,
  obtenerGrupos,
  gruposActivos,
  editarGrupo,
};
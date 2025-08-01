const Usuario = require("../models/usuarios");
const Grupos = require("../models/grupos");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { OUTLOOK_EMAIL, apikey, OUTLOOK_PASSWORD } = require("../constants");
require("dotenv").config({ path: ".env" });

//ADMINISTRADOR
//FUNCION PARA REGISTRAR UN NUEVO USUARIO DE MANERA INDIVIDUAL. SUGERENCIA DE USO: FORMULARIO
//MANDA UN EMAIL AL CORREO DEL USUARIO REGISTRADO CON LOS DATOS CON LOS QUE FUE REGISTRADO
//LA FUNCION INCLUYE UNA CONDICION EN LA QUE SI SE DETECTA QUE EL ROL A REGISTRAR ES DE ADMINISTRADOR DE APOYO(AP) EVALUA QUE NO EXISTAN TRES O MAS, EN CASO DE SER ASI, NO SE PODRA REGISTRAR
async function crearUsuarioIndividual(req, res) {
  const {
    matricula,
    nombre,
    apellido_paterno,
    apellido_materno,
    plantel,
    correo,
    rol,
  } = req.body;

  if (!nombre) res.status(400).send({ msg: "Nombre es requerido" });
  if (!plantel) res.status(400).send({ msg: "Plantel es requerido" });
  if (!correo) res.status(400).send({ msg: "Correo es requerido" });
  if (!rol) res.status(400).send({ msg: "rol es requerido" });

  if (rol === "AP") {
    const adminAPResponse = await Usuario.find({ rol: "AP" });
    if (adminAPResponse.length > 2) {
      res.status(400).send({
        msg: "Se ha cumplido el limite de administradores de apoyo, no se puede registrar",
      });
      return;
    }
  }

  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  let password = "";

  for (i = 0; i < 17; i++) {
    let index = Math.floor(Math.random() * caracteres.length);

    password += caracteres.charAt(index);
  }

  //hasheo de password
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  const usuario = new Usuario({
    matricula,
    nombre,
    apellido_paterno,
    apellido_materno,
    plantel,
    correo,
    rol,
    password: hashPassword,
  });

  //funcion para convertir el codigo del plantel y rol al nombre del plantel y rol para poder mostrarlo en el correo
  let plantelNombre = "";
  let rolNombre = "";

  switch (plantel) {
    case "A":
      plantelNombre = "Atizapan";
      break;
    case "H":
      plantelNombre = "Chalco";
      break;
    case "C":
      plantelNombre = "Coacalco";
      break;
    case "U":
      plantelNombre = "Cuautitlán";
      break;
    case "E":
      plantelNombre = "Ecatepec";
      break;
    case "X":
      plantelNombre = "Ixtapaluca";
      break;
    case "I":
      plantelNombre = "Iztapalapa";
      break;
    case "N":
      plantelNombre = "Neza";
      break;
    case "R":
      plantelNombre = "Reyes";
      break;
    case "T":
      plantelNombre = "Toluca";
      break;
    case "S":
      plantelNombre = "Toreo";
      break;
    case "Z":
      plantelNombre = "Zona Rosa";
      break;
    case "V":
      plantelNombre = "Havre";
      break;
    case "D":
      plantelNombre = "Online";
      break;
  }

  switch (rol) {
    case "A":
      rolNombre = "Administrador";
      break;
    case "AP":
      rolNombre = "Administrador de apoyo";
      break;
    case "C":
      rolNombre = "Consultor";
      break;
    case "U":
      rolNombre = "Usuario";
      break;
  }

  //envio de correo al usuario creado informando sobre su registro y sus datos registrados

  /*const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: OUTLOOK_EMAIL,
      pass: OUTLOOK_PASSWORD,
    },
  }); */

  //SERVICIO CREADO CON SENDGRID
  /*const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.user_SendGrid,
      pass: process.env.apikey,
    },
  });*/

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: OUTLOOK_EMAIL,
        pass: apikey,
    },
  });

  const opcionesCorreo = {
    from: process.env.OUTLOOK_EMAIL,
    to: correo,
    subject: "Confirmación de alta en Gestión y análisis de asistencias UTC",
    text: `Por este medio le informamos que usted ha sido registrado en la aplicación web 'Gestión y análisis de asistencias UTC' con los siguientes datos:\n\n\nMatricula: ${matricula}\nNombre: ${nombre} ${apellido_paterno} ${apellido_materno}\nPlantel: ${plantelNombre}\nCorreo: ${correo}\nContraseña: ${password}\nRol: ${rolNombre}\n\n\nInicie sesión utilizando el correo y contraseña mostrados en la parte de arriba\n\nLa contraseña que se le proporcionó fue generada de manera automática y anónima, puede cambiarla dentro de la aplicación en la barra superior de Opciones / Cambiar contraseña\n\nPara aclaraciones favor de contactarse al siguiente correo: uconfortasist@gmail.com`,
  };

  await usuario.save((error, userStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el usuario" });
      console.log(error);
      return;
    } else {
      res.status(200).send({
        msg: "Usuario registrado, se ha enviado un email a su correo",
      });
      transporter.sendMail(opcionesCorreo, (error, info) => {
        if (error) {
          console.log("Error al enviar el correo", error);
        } else {
          console.log("Correo enviado", info);
        }
      });
    }
  });
}

//ADMINISTRADOR
//FUNCION PARA CARGAR UN ARRAY CON OBJETOS JSON CON DATOS DE LOS USUARIOS A REGISTRAR. EL ARRAY ES OBTENIDO DEL CLIENTE A TRAVES DE UN CSV
//MANDA UN EMAIL A CADA USUARIO REGISTRADO CON LOS DATOS CON LOS QUE SE LES REGISTRO
async function crearListaUsuario(req, res) {
  let usuariosArray = req.body;
  let passwordArray = [];
  let password = "";
  let caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let salt = "";
  let hashPassword = "";

  /* por si sale mal sendgrid
  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: OUTLOOK_EMAIL,
      pass: OUTLOOK_PASSWORD,
    },
  });
  */

  //CONDICION PARA EVALUAR QUE NO SE REGISTRAS ADMINISTRADORES DE PAOYO QUE EXCEDAN EL LIMITE DE TRES
  let rolAP = [];

  for (var i = 0; i < usuariosArray.length; i++) {
    if (usuariosArray[i].rol === "AP") rolAP.push(usuariosArray[i].rol);
  }

  if (rolAP.length > 3) {
    res.status(400).send({
      msg: "Se esta intentando agregar mas de tres usuarios de tipo Administrador de apoyo, favor de revisar la lista que esta cargando",
    });
    return;
  }

  if (rolAP.length > 0) {
    const adminAPResponse = await Usuario.find({ rol: "AP" });

    if (rolAP.length + adminAPResponse.length > 3) {
      res.status(400).send({
        msg: "Error, se esta intentando registrar una cantidad de administradores de apoyo que excede el limite de usuarios con este tipo de rol",
      });
      return;
    }
  }

  //SERVICIO CREADO CON SENDGRID
  /*const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.user_SendGrid,
      pass: process.env.apikey,
    },
  });*/
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: OUTLOOK_EMAIL,
        pass: apikey,
    },
  });

  //CREANDO PASSWORD PARA CADA USUARIO EN EL ARRAY
  for (var i = 0; i < usuariosArray.length; i++) {
    //CREACION DE PASSWORDS
    for (var j = 0; j < 17; j++) {
      let index = Math.floor(Math.random() * caracteres.length);
      password += caracteres.charAt(index);
    }

    passwordArray.push(password);

    //HASHEO DE PASSWORD
    salt = bcrypt.genSaltSync(10);
    hashPassword = bcrypt.hashSync(password, salt);
    usuariosArray[i].password = hashPassword;

    //RESETEAR VARIABLES
    password = "";
    hashPassword = "";
  }

  try {
    const usuariosCreados = await Usuario.insertMany(usuariosArray);

    for (var k = 0; k < usuariosArray.length; k++) {
      const {
        matricula,
        nombre,
        apellido_paterno,
        apellido_materno,
        plantel,
        correo,
        rol,
      } = usuariosArray[k];

      //funcion para convertir el codigo del plantel y rol al nombre del plantel y rol para poder mostrarlo en el correo
      let plantelNombre = "";
      let rolNombre = "";

      switch (plantel) {
        case "A":
          plantelNombre = "Atizapan";
          break;
        case "H":
          plantelNombre = "Chalco";
          break;
        case "C":
          plantelNombre = "Coacalco";
          break;
        case "U":
          plantelNombre = "Cuautitlán";
          break;
        case "E":
          plantelNombre = "Ecatepec";
          break;
        case "X":
          plantelNombre = "Ixtapaluca";
          break;
        case "I":
          plantelNombre = "Iztapalapa";
          break;
        case "N":
          plantelNombre = "Neza";
          break;
        case "R":
          plantelNombre = "Reyes";
          break;
        case "T":
          plantelNombre = "Toluca";
          break;
        case "S":
          plantelNombre = "Toreo";
          break;
        case "Z":
          plantelNombre = "Zona Rosa";
          break;
        case "V":
          plantelNombre = "Havre";
          break;
        case "D":
          plantelNombre = "Online";
          break;
      }

      switch (rol) {
        case "A":
          rolNombre = "Administrador";
          break;
        case "AP":
          rolNombre = "Administrador de apoyo";
          break;
        case "C":
          rolNombre = "Consultor";
          break;
        case "U":
          rolNombre = "Usuario";
          break;
      }

      //envio de correo al usuario creado informando sobre su registro y sus datos registrados

      let opcionesCorreo = {
        from: process.env.OUTLOOK_EMAIL,
        to: correo,
        subject:
          "Confirmación de alta en Gestión y análisis de asistencias UTC",
        text: `Por este medio le informamos que usted ha sido registrado en la aplicación web 'Gestión y análisis de asistencias UTC' con los siguientes datos:\n\n\nMatricula: ${matricula}\nNombre: ${nombre} ${apellido_paterno} ${apellido_materno}\nPlantel: ${plantelNombre}\nCorreo: ${correo}\nContraseña: ${password}\nRol: ${rolNombre}\n\n\nInicie sesión utilizando el correo y contraseña mostrados en la parte de arriba\n\nLa contraseña que se le proporcionó fue generada de manera automática y anónima, puede cambiarla dentro de la aplicación en la barra superior de Opciones / Cambiar contraseña\n\nPara aclaraciones favor de contactarse al siguiente correo: uconfortasist@gmail.com'`,
      };

      await transporter.sendMail(opcionesCorreo, async (error, info) => {
        if (error) {
          console.log("Error al enviar el correo", error);
        } else {
          console.log("Correo enviado", info);
        }
      });
    }

    res.status(200).send({
      msg: "Se ha registrado la ista de usuarios, se les ha enviado un email al correo de cada usuario ",
    });
  } catch (error) {
    res.status(400).send({ msg: "Error al cargar la lista de usuarios" });
    throw error;
  }
}

//ADMINISTRADOR
//FUNCION PARA BUSCAR UN USUARIO Y ELIMINARLO
//EN CASO DE QUE EL USUARIO SEA CONSULTOR, SE EVALUA QUE NO TENGA GRUPOS GUARDADOS, EN CASO DE QUE LOS TENGA, NO SE PUEDE ELIMINAR AL USUARIO
async function borrarUsuario(req, res) {
  const { matricula } = req.body;

  try {
    const usuarioAEliminar = await Usuario.findOne({ matricula });

    if (usuarioAEliminar.rol === "C") {
      if (usuarioAEliminar.grupos.length > 0) {
        res.status(400).send({
          msg: "Error al eliminar usuario, aun tiene grupos asignados",
        });
        return;
      }
    }

    const usuarioEliminado = await Usuario.findOneAndDelete({ matricula });

    if (!usuarioEliminado) {
      res.status(400).send({ msg: "Error al eliminar usuario" });
    } else {
      res.status(200).send({ msg: "Usuario eliminado" });
    }
  } catch (error) {
    throw error;
  }
}

//ADMINISTRADOR / CONSULTOR
//FUNCION PARA ACTUALIZAR DATOS DE UN USUARIO
//PUEDE SER USADO POR EL ADMINISTRADOR EN CASO DE QUE UN CONSULTOR NO TENGA CORRECTAMENTE REGISTRADO SU MATRICULA, PLANTEL, CORREO O ROL Y TENGA QUE SER CAMBIADO. NO DEBE DE ACTUALIZAR OTROS VALORES
//PUEDE SER USADO POR EL CONSLUTOR PARA MODIFICAR SUS DATOS PERSONAELES COMO NOMBRE, APELLIDOS Y PASSWORD
async function actualizarUsuario(req, res) {
  const {
    matriculaOriginal,
    matriculaCambio,
    nombre,
    apellido_paterno,
    apellido_materno,
    plantel,
    correo,
    rol,
    password,
  } = req.body;

  //hasheo de password
  let hashPassword = "";

  if (password) {
    const salt = bcrypt.genSaltSync(10);

    hashPassword = bcrypt.hashSync(password, salt);
  } else {
    hashPassword = undefined;
  }

  let matricula = "";

  if (matriculaCambio) {
    matricula = matriculaCambio;
  } else {
    matricula = matriculaOriginal;
  }

  try {
    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { matricula: matriculaOriginal },
      {
        $set: {
          matricula,
          nombre,
          apellido_paterno,
          apellido_materno,
          plantel,
          correo,
          rol,
          password: hashPassword,
        },
      },
      { new: true }
    );

    if (!usuarioActualizado) {
      res.status(400).send({ msg: "Error al actualizar datos del usuario" });
    } else {
      res.status(200).send({ msg: "Datos del usuario actualizado" });
    }
  } catch (error) {
    throw error;
  }
}

//ADMINISTRADOR
//FUNCION PARA OBTENER A TODOS LOS USUARIOS CON ROL DE USUARIO (ANTERIORMENTE RECTOR) REGISTRADOS
async function obtenerUsuarios(req, res) {
  const response = await Usuario.find({  });

  for (var i = 0; i < response.length; i++) {
    response[i].password = undefined;
  }

  if (!response) {
    res.status(400).send({ msg: "Error al obtener los usuarios" });
  } else {
    res.status(200).send(response);
  }
}

//ADMINISTRADOR
//FUNCION PARA OBTENER A TODOS  LOS USUARIOS CON ROL DE CONSULTOR REGISTRADOS
async function obtenerConsultores(req, res) {
  const response = await Usuario.find({ rol: "C" });

  for (var i = 0; i < response.length; i++) {
    response[i].password = undefined;
  }

  if (!response) {
    res.status(400).send({ msg: "Error al obtener los usuarios" });
  } else {
    res.status(200).send(response);
  }
}

//ADMINISTRADOR
//FUNCION PARA OBTENER A TODOS LOS ADMINISTRADORES DE APOYO
async function obtenerAdministradoresApoyo(req, res) {
  const response = await Usuario.find({ rol: "AP" });

  for (var i = 0; i < response.length; i++) {
    response[i].password = undefined;
  }

  if (!response) {
    res.status(400).send({ msg: "Error al obtener los usuarios" });
  } else {
    res.status(200).send(response);
  }
}

//ADMINISTRADOR
//OBTIENE LOS DATOS DEL UNICO ADMINISTRADOR QUE DEBE DE EXISTIR
async function obtenerAdministrador(req, res) {
  const response = await Usuario.findOne({ rol: "A" });

  response.password = undefined;

  if (!response) {
    res.status(400).send({ msg: "Error al obtener los usuarios" });
  } else {
    res.status(200).send(response);
  }
}

//ADMINISTRADOR
//OBTENER LOS DATOS DE UN USUARIO PARA VER SUS DATOS O HACER CIERTAS ACCIONES COMO OBTENER SU MATRICULA PARA ACTUALIZARLO O ELIMINARLO
async function obtenerUnicoUsuario(req, res) {
  const { matricula } = req.body;

  const response = await Usuario.findOne({ matricula });

  response.password = undefined;

  if (!response) {
    res.status(400).send({ msg: "Error al obtener los datos del usuario" });
  } else {
    res.status(200).send(response);
  }
}

//CONSULTOR
//FUNCION PARA AGREGAR GRUPOS Y ESTABLECER LA DISPONIBILIDAD DEL GRUPO EN FALSO PARA QUE NO SE PUEDA VOLVER A SELECCIONAR
async function agregarGrupo(req, res) {
  const { matricula, grupo } = req.body;

  const Grupo = await Grupos.findOne({ grupo });

  if (Grupo.disponible) {
    const gruposActualizado = await Usuario.findOneAndUpdate(
      { matricula },
      { $push: { grupos: grupo } },
      { new: true }
    );

    //ESTABLECE LA DISPONIBILIDAD DEL GRUPO EN FALSO
    const grupoActualizado = await Grupos.findOneAndUpdate(
      { grupo },
      { disponible: false },
      { new: true }
    );

    if (!gruposActualizado) {
      res.status(400).send({ msg: "Error al agregar grupo" });
    } else {
      res.status(200).send({ msg: "Grupos del consultor actualizado" });
    }
  } else {
    res
      .status(400)
      .send({ msg: "Error al agregar grupo, no se encuentra disponible" });
  }
}

//CONSULTOR Y ADMINISTRADOR
//FUNCION PARA QUITAR UN GRUPO A UN CONSULTOR, SIRVE PARA CUANDO UN CONSULTOR SE QUIERE DESASIGNAR UN GRUPO O CUANDO UN ADMINISTRADOR TIENE QUE DESASIGNARLE UN GRUPO A UN CONSULTOR
async function quitarGrupo(req, res) {
  const { matricula, grupo } = req.body;

  const gruposActualizado = await Usuario.findOneAndUpdate(
    { matricula },
    { $pull: { grupos: grupo } },
    { new: true }
  );

  const grupoActualizado = await Grupos.findOneAndUpdate(
    { grupo },
    { disponible: true },
    { new: true }
  );

  if (!gruposActualizado) {
    res.status(400).send({ msg: "Error al quitar grupo" });
  } else {
    res.status(200).send({ msg: "Grupos del consultor actualizados" });
  }
}

//ADMINISTRADOR
//FUNCION PARA VOLVER A ENVIAR CORREO DE REGISTRO DONDE VIENE LA PASSWORD GENERADA AUTOMATICAMENTE PARA PODER INICIAR SESION
async function reenviarCorreo(req, res) {
  const { matricula } = req.body;

  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  let password = "";

  for (i = 0; i < 17; i++) {
    let index = Math.floor(Math.random() * caracteres.length);

    password += caracteres.charAt(index);
  }

  //hasheo de password
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  const usuarioResponse = await Usuario.findOne({ matricula });

  //funcion para convertir el codigo del plantel y rol al nombre del plantel y rol para poder mostrarlo en el correo
  let plantelNombre = "";
  let rolNombre = "";

  switch (usuarioResponse.plantel) {
    case "A":
      plantelNombre = "Atizapan";
      break;
    case "H":
      plantelNombre = "Chalco";
      break;
    case "C":
      plantelNombre = "Coacalco";
      break;
    case "U":
      plantelNombre = "Cuautitlán";
      break;
    case "E":
      plantelNombre = "Ecatepec";
      break;
    case "X":
      plantelNombre = "Ixtapaluca";
      break;
    case "I":
      plantelNombre = "Iztapalapa";
      break;
    case "N":
      plantelNombre = "Neza";
      break;
    case "R":
      plantelNombre = "Reyes";
      break;
    case "T":
      plantelNombre = "Toluca";
      break;
    case "S":
      plantelNombre = "Toreo";
      break;
    case "Z":
      plantelNombre = "Zona Rosa";
      break;
    case "V":
      plantelNombre = "Havre";
      break;
    case "D":
      plantelNombre = "Online";
      break;
  }

  switch (usuarioResponse.rol) {
    case "A":
      rolNombre = "Administrador";
      break;
    case "AP":
      rolNombre = "Administrador de apoyo";
      break;
    case "C":
      rolNombre = "Consultor";
      break;
    case "U":
      rolNombre = "Usuario";
      break;
  }

  //envio de correo al usuario creado informando sobre su registro y sus datos registrados
  /*const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.user_SendGrid,
      pass: process.env.apikey,
    },
  });*/

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: OUTLOOK_EMAIL,
        pass: apikey,
    },
  });

  const opcionesCorreo = {
    from: process.env.OUTLOOK_EMAIL,
    to: usuarioResponse.correo,
    subject: "Confirmación de alta en Gestión y análisis de asistencias UTC",
    text: `Por este medio le informamos que usted ha sido registrado en la aplicación web 'Gestión y análisis de asistencias UTC' con los siguientes datos:\n\n\nMatricula: ${matricula}\nNombre: ${nombre} ${apellido_paterno} ${apellido_materno}\nPlantel: ${plantelNombre}\nCorreo: ${correo}\nContraseña: ${password}\nRol: ${rolNombre}\n\n\nInicie sesión utilizando el correo y contraseña mostrados en la parte de arriba\n\nLa contraseña que se le proporcionó fue generada de manera automática y anónima, puede cambiarla dentro de la aplicación en la barra superior de Opciones / Cambiar contraseña\n\nPara aclaraciones favor de contactarse al siguiente correo: uconfortasist@gmail.com'`,
  };

  try {
    await Usuario.findOneAndUpdate(
      { matricula },
      { $set: { password: hashPassword } },
      { new: true }
    );

    transporter.sendMail(opcionesCorreo, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo", error);
        res.status(400).send({ msg: "Error al reenviar el correo al usuario" });
      } else {
        console.log("Correo enviado", info);
        res.status(200).send({ msg: "Se ha reenviado el correo al usuario" });
      }
    });
  } catch (error) {
    res.status(400).send({ msg: "Error al reenviar el correo al usuario" });
    throw error;
  }
}

module.exports = {
  crearUsuarioIndividual,
  crearListaUsuario,
  borrarUsuario,
  actualizarUsuario,
  obtenerUsuarios,
  obtenerConsultores,
  obtenerAdministradoresApoyo,
  obtenerAdministrador,
  obtenerUnicoUsuario,
  agregarGrupo,
  quitarGrupo,
  reenviarCorreo,
};
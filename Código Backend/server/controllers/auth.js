// Importación del modelo de usuario y librerías necesarias
const Usuarios = require("../models/usuarios"); // Modelo de usuario en MongoDB
const bcrypt = require("bcrypt"); // Librería para comparar contraseñas encriptadas
const jwt = require("../utils/jwt"); // Utilidad para generar tokens JWT

// Función para manejar el inicio de sesión
async function login(req, res) {
  // Extrae el correo y la contraseña del cuerpo de la solicitud
  const { correo, password } = req.body;

  // Validaciones básicas de campos
  if (!correo) res.status(400).send({ msg: "El correo es obligatorio" });
  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  // Verifica si existe un usuario con ese correo
  const existenciaUsuario = await Usuarios.findOne({ correo });

  // Si no se encuentra el usuario, se responde con error
  if (!existenciaUsuario) {
    res.status(400).send({
      msg: "No se encontró ningún usuario con esas credenciales en existenciaUsuario",
    });
  } else {
    // Si el usuario existe, se compara la contraseña enviada con la guardada en la base de datos
    bcrypt.compare(
      password,
      existenciaUsuario.password,
      (bcryptError, check) => {
        if (bcryptError) {
          // Error interno del servidor al comparar contraseñas
          res.status(500).send({ msg: "Error del servidor" });
          console.log(bcryptError);
        } else if (!check) {
          // Si la contraseña no coincide
          res.status(400).send({ msg: "Error en la comprobación del usuario" });
        } else {
          // Si todo es correcto, se elimina la contraseña del objeto para no enviarla al cliente
          existenciaUsuario.password = undefined;

          // Se genera un token de acceso JWT y se envía junto con los datos del usuario
          res.status(200).send({
            access: jwt.crearAccessToken(existenciaUsuario),
            existenciaUsuario,
          });
        }
      }
    );
  }
}

// Exporta la función para que pueda ser utilizada en las rutas
module.exports = {
  login,
};
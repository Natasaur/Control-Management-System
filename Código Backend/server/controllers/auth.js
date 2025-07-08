const Usuarios = require("../models/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");

async function login(req, res) {
  const { correo, password } = req.body;

  if (!correo) res.status(400).send({ msg: "El correo es obligatorio" });
  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  const existenciaUsuario = await Usuarios.findOne({ correo });

  if (!existenciaUsuario) {
    res
      .status(400)
      .send({ msg: "No se encontro ningun usuario con esas credenciales en existenciaUsuario" });
  } else {
    bcrypt.compare(
      password,
      existenciaUsuario.password,
      (bcryptError, check) => {
        if (bcryptError) {
          res.status(500).send({ msg: "Error del servidor" });
          console.log(bcryptError);
        } else if (!check) {
          res.status(400).send({ msg: "Error en la comprobacion del usuario" });
        } else {
          existenciaUsuario.password = undefined;

          res.status(200).send({
            access: jwt.crearAccessToken(existenciaUsuario),
            existenciaUsuario,
          });
        }
      }
    );
  }
}

module.exports = {
  login,
};
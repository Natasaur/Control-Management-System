const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

function crearAccessToken(usuario) {
  const expToken = new Date();
  expToken.setHours(expToken.getHours() + 12);

  const payload = {
    token_type: "access",
    iat: Date.now(),
    exp: expToken.getTime(),
    matricula: usuario.matricula,
    rol: usuario.rol,
  };

  return jwt.sign(payload, process.env.SECRET_KEY);
}

function crearRefreshToken(usuario) {
  const expToken = new Date();
  expToken.setMonth(expToken.getMonth() + 12);

  const payload = {
    toekn_type: "refresh",
    iat: Date.now(),
    exp: expToken.getTime(),
    matricula: usuario.matricula,
    rol: usuario.rol,
  };

  return jwt.sign(payload, process.env.SECRET_KEY);
}

function decode(token) {
  return jwt.decode(token, process.env.SECRET_KEY, true);
}

module.exports = {
  crearAccessToken,
  crearRefreshToken,
  decode,
};
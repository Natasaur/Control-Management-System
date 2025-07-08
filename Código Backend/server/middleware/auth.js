const jwt = require("../utils/jwt");

function authAdmin(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({ msg: "Error, no se encuentra la cabecera de autorización" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const payload = jwt.decode(token);
    const { exp, rol } = payload;
    const currentDate = Math.floor(Date.now() / 1000);

    if (exp <= currentDate) {
      return res.status(401).send({ msg: "Token ha expirado" });
    }

    if (rol !== "A") {
      return res
        .status(403)
        .send({ msg: "Usuario no válido para esta acción" });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(400).send({ msg: "Error en la autorización", error });
  }
}

module.exports = {
  authAdmin,
};


/*
const jwt = require("../utils/jwt");

function authAdmin(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({ msg: "Error, no se encuentra la cabecera de autorizacion" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");
  console.log("Hola!!!")
  console.log(token)

  try {
    const payload = jwt.decode(token);
    const { exp, rol } = payload;
    //const { rol } = payload;
    const currentDate = Math.floor(Date.now() / 1000); // convertir a segundos

    if (exp <= currentDate) {
      return res.status(401).send({ msg: "Token ha expirado" });
    }

    if (rol != "A") {
      return res
        .status(403)
        .send({ msg: "Usuario no valido para esta accion" });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(400).send({ msg: "Error en la autorizacion", error });
  }
}

function authAdminAP(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(400)
      .send({ msg: "Error, no se encuentra la cabecera de autorizacion en AuthAdminAP" });
  }

  const token = req.headers.authorization;


  try {
    const payload = jwt.decode(token);
    const { exp } = payload;
    const { rol } = payload;
    const currentDate = Math.floor(Date.now() / 1000); // convertir a segundos


    if (exp <= currentDate) {
      return res.status(400).send({ msg: "Token ha expirado" });
    }

    if (rol === "A" || rol === "AP") {
      return next();
    }
    return res.status(400).send({ msg: "Usuario no valido para esta accion" });
  } catch (error) {
    return res.status(400).send({ msg: "Error en la autorizacion" });
  }
}

function authConsultor(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(400)
      .send({ msg: "Error, no se encuentra la cabecera de autorizacion" });
  }

  const token = req.headers.authorization;

  try {
    const payload = jwt.decode(token);
    const { exp } = payload;
    const { rol } = payload;
    const currentDate = Math.floor(Date.now() / 1000); // convertir a segundos

    if (exp <= currentDate) {
      return res.status(400).send({ msg: "Token ha expirado" });
    }

    if (rol != "C") {
      return res
        .status(400)
        .send({ msg: "Usuario no valido para esta accion" });
    }

    return next();
  } catch (error) {
    return res.status(400).send({ msg: "Error en la autorizacion" });
  }
}

function authAdminConsultor(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(400)
      .send({ msg: "Error, no se encuentra la cabecera de autorizacion" });
  }

  const token = req.headers.authorization;

  try {
    const payload = jwt.decode(token);
    const { exp } = payload;
    const { rol } = payload;
    const currentDate = Math.floor(Date.now() / 1000); // convertir a segundos

    if (exp <= currentDate) {
      return res.status(400).send({ msg: "Token ha expirado" });
    }

    if (rol === "C" || rol === "A" || rol === "AP") {
      return next();
    }

    return res.status(400).send({ msg: "Usuario no valido para esta accion" });
  } catch (error) {
    return res.status(400).send({ msg: "Error en la autorizacion" });
  }
}

function authUsuario(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(400)
      .send({ msg: "Error, no se encuentra la cabecera de autorizacion" });
  }

  const token = req.headers.authorization;

  try {
    const payload = jwt.decode(token);
    const { exp } = payload;
    const { rol } = payload;
    const currentDate = Math.floor(Date.now() / 1000); // convertir a segundos

    if (exp <= currentDate) {
      return res.status(400).send({ msg: "Token ha expirado" });
    }

    if (rol != "U") {
      return res
        .status(400)
        .send({ msg: "Usuario no valido para esta accion" });
    }

    return next();
  } catch (error) {
    return res.status(400).send({ msg: "Error en la autorizacion" });
  }
}

function authAdminConsultorUsuario(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(400)
      .send({ msg: "Error, no se encuentra la cabecera de autorizacion" });
  }

  const token = req.headers.authorization;

  try {
    const payload = jwt.decode(token);
    const { exp } = payload;
    const { rol } = payload;
    const currentDate = Math.floor(Date.now() / 1000); // convertir a segundos

    if (exp <= currentDate) {
      return res.status(400).send({ msg: "Token ha expirado" });
    }

    if (rol === "C" || rol === "A" || rol === "AP" || rol === "U") {
      return next();
    }

    return res.status(400).send({ msg: "Usuario no valido para esta accion" });
  } catch (error) {
    return res.status(400).send({ msg: "Error en la autorizacion" });
  }
}

module.exports = {
  authAdmin,
  authAdminAP,
  authConsultor,
  authAdminConsultor,
  authUsuario,
  authAdminConsultorUsuario
};
*/
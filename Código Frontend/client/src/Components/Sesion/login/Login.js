import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import Cookies from "js-cookie";
import backgroundImage from "../../../img/UTC-1.jpg";
import { ENV } from "../../../utils/Constants";

//const Login = ({ setToken, setRol }) => {
const Login = ({ setToken, setIsAuthenticated }) => {
  const BASE_PATH = ENV.BASE_PATH;
  const inicioRoute = ENV.API_ROUTES.nvQNHOaD1pGaVnr6MEpaeRsYAxiH8kM4L0;
  const [mostrarpassword, setMostrarpassword] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState(null);
  const navigate = useNavigate();

  const alternarMostrarpassword = () => {
    setMostrarpassword(!mostrarpassword);
  };

  const iniciarSesión = () => {
    if (!correo || !password) {
      mostrarAlerta("Por favor, ingresa tu correo electrónico y contraseña", "danger");
      return;
    }

    /*const datosUsuario = {
      correo: correo,
      password: password,
    };*/

    const datosUsuario = {
      correo,
      password,
    };

    const url = `${BASE_PATH}${inicioRoute}`;

    axios
      .post(url, datosUsuario, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const datos = response.data;

        if (datos.access) {
          const tiempoExpiracion = 0.5; //medio dia

          //Guardar token
          Cookies.set("token", datos.access, { expires: tiempoExpiracion });

          //Guardar otros datos 
          if (datos.existenciaUsuario?.matricula) {
            Cookies.set("matricula", datos.existenciaUsuario.matricula, {
              expires: tiempoExpiracion,
            });
          }

          if (datos.existenciaUsuario?.plantel) {
            Cookies.set("plantel", datos.existenciaUsuario.plantel, {
              expires: tiempoExpiracion,
            });
          }

          Cookies.set("nombre", datos.existenciaUsuario.nombre || "",{ expires: tiempoExpiracion });
          Cookies.set("apellido_paterno", datos.existenciaUsuario.apellido_paterno || "",{ expires: tiempoExpiracion });
          Cookies.set("apellido_materno", datos.existenciaUsuario.apellido_materno || "",{ expires: tiempoExpiracion });

          // Actualizar estado en APP
          //setToken(datos.access);

          setIsAuthenticated(true);
          // Redirigir siempre al dashboard
          navigate("/dashboard");

        } else {
          mostrarAlerta(datos.msg, "danger");
        }
      })
      .catch((error) => {
        console.error(error);
        mostrarAlerta("Correo o contraseña incorrecta", "danger");
      });
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => {
      setAlerta(null);
    }, 3000);
  };

  const estiloFondo = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    filter: "blur(10px)",
  };

  const estiloContenedor = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
  };

  const estiloTarjeta = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    width: "600px",
    maxWidth: "100%",
  };

  const estiloGrupoEntrada = {
    position: "relative",
  };

  const estiloBotonMostrarpassword = {
    position: "absolute",
    top: "50%",
    right: "2px",
    transform: "translateY(-50%)",
    backgroundColor: "#FFFFFF",
    border: "none",
    cursor: "pointer",
    outline: "none",
  };

  return (
    <div>
      <div style={estiloFondo}></div>
      <div style={estiloContenedor}>
        <div className="card" style={estiloTarjeta}>
          <div className="card-body">
            <h2 className="card-title mb-4">Inicio de sesión</h2>
            <Form>
              <Form.Group controlId="formcorreo">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="correo"
                  placeholder="Ingrese su correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <div style={estiloGrupoEntrada}>
                  <Form.Control
                    type={mostrarpassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="link"
                    onClick={alternarMostrarpassword}
                    style={estiloBotonMostrarpassword}
                  >
                    {mostrarpassword ? <EyeSlash /> : <Eye />}
                  </Button>
                </div>
              </Form.Group>
              <Link to="/password" className="d-block mb-3">
                ¿Se te olvidó la contraseña?
              </Link>
              <Button variant="primary" onClick={iniciarSesión}>
                Iniciar sesión
              </Button>
            </Form>
          </div>
          {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}
        </div>
      </div>
    </div>
  );
};

export default Login;

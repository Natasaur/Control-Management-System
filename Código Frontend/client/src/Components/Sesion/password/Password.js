import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import logo from "../../../img/utc.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { ENV } from "../../../utils/Constants";

export default function Password() {
    const BASE_PATH = ENV.BASE_PATH;
    const restablecerRoute = ENV.API_ROUTES.BKn8x4vGsHimj8qRwDZj36nmW4scIAAsRC;
    const [matricula, setMatricula] = useState("");
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mostrarError, setMostrarError] = useState(false);

    const handleResetPassword = async () => {
        try {
            const urlReenviar = `${BASE_PATH}${restablecerRoute}`;
            await axios.patch(urlReenviar,
                {
                    matricula: matricula
                }
            );
            setMostrarAlerta(true);
        } catch (error) {
            console.error(error);
            setMostrarError(true);
        }
    };

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <div className="text-center mb-4">
                    <img src={logo} alt="Logo UTC" height="72" />
                    <h2 className="mt-2">Restablecer contraseña</h2>
                </div>
                <Form>
                    <Form.Group controlId="formMatricula">
                        <Form.Label>Ingrese su matrícula</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Matrícula"
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        className="w-100 mt-3"
                        onClick={handleResetPassword}
                    >
                        Restablecer contraseña
                    </Button>
                </Form>
                <div className="text-center mt-3">
                    <Link to="/">Volver a inicio de sesión</Link>
                </div>
                {mostrarAlerta && (
                    <Alert variant="success" className="mt-3">
                        La contraseña ha sido restablecida. Por favor, revise su correo electrónico para obtener la nueva contraseña.
                    </Alert>
                )}
                {mostrarError && (
                    <Alert variant="danger" className="mt-3">
                        Ocurrió un error al restablecer la contraseña. Por favor, inténtelo de nuevo más tarde.
                    </Alert>
                )}
            </div>
        </Container>
    );
}

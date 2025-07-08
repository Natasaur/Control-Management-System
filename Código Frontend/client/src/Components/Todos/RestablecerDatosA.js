import { useState, useEffect } from "react";
import { Container, ListGroup, Button, Modal, Alert, Form, Card } from "react-bootstrap";
import axios from "axios";
import MargenA from "../Extras/MargenA";
import './CSS/style.css';
import Cookie from 'js-cookie';
import { ENV } from "../../utils/Constants";

const EditarUsuarioForm = () => {
    const BASE_PATH = ENV.BASE_PATH;
    const actualizarURoute = ENV.API_ROUTES.G22HHEoHdp2J1jF4JShU8w8ixWpbs6g7Ft1ViZbuvPoNNl23dAU;
    const usuarioAPRoute = ENV.API_ROUTES.L4bGEcZxAnjetUarpJVSCVOexDA4I8MYQwlLiL6CXUZzzh3zsIMaOAA;
    const token = Cookie.get('token');
    const matriculaCon = Cookie.get('matricula');
    const [campoSeleccionado, setCampoSeleccionado] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showAlerta, setShowAlerta] = useState(false);
    const [showCerrandoSesion, setShowCerrandoSesion] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
        matriculaOriginal: "",
        rol: "",
    });
    const [usuario, setUsuario] = useState({
        matriculaOriginal: "",
        matriculaCambio: "",
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        plantel: "",
        correo: "",
        rol: "",
        password: ""
    });
    const [usuariosAP, setUsuariosAP] = useState([]);
    const [listaCargada, setListaCargada] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState("");

    useEffect(() => {
        if (showCerrandoSesion) {
            const handleLogout = () => {
                Cookie.remove('token');
                Cookie.remove('matricula');
                Cookie.remove('plantel');
                Cookie.remove('rol');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            };

            handleLogout();
        }
    }, [showCerrandoSesion]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setShowAlerta(false);

        if (name === "password") {
            if (value.length >= 8) {
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
                if (!passwordRegex.test(value)) {
                    setErrorMensaje(
                        "La contraseña debe contener al menos una mayúscula, un número y un carácter especial."
                    );
                    setShowAlerta(true);
                } else {
                    setErrorMensaje("Contraseña válida");
                }
            } else {
                setErrorMensaje("La contraseña debe tener al menos 8 caracteres.");
                setShowAlerta(true);
            }
        }

        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: value || "",
        }));
    };

    const handleCampoSeleccionado = async (campo) => {
        if (campo === campoSeleccionado) {
            setCampoSeleccionado("");
        } else {
            setCampoSeleccionado(campo);
            if (campo === "rol" && !listaCargada) {
                await fetchUsuarios();
                setListaCargada(true);
            }
        }
    };

    const handleActualizar = (event) => {
        event.preventDefault();
        setShowModal(true);
    };

    const handleConfirmacion = async () => {
        const matriculaConfirmacion = usuario.matriculaOriginal;

        if (matriculaConfirmacion === matriculaCon) {
            try {
                const usuarioActualizado = {};

                for (const key in usuario) {
                    if (usuario.hasOwnProperty(key) && usuario[key] !== "") {
                        usuarioActualizado[key] = usuario[key];
                    }
                }

                if (!usuarioActualizado.matriculaCambio) {
                    usuarioActualizado.matriculaOriginal = matriculaConfirmacion;
                }

                setShowCerrandoSesion(true);

                console.log(usuarioActualizado)
                console.log(usuarioSeleccionado)

                if (usuarioSeleccionado !== null && usuarioSeleccionado.matriculaOriginal !== "") {
                    usuarioActualizado.rol = "AP";
                    usuarioSeleccionado.rol = "A";
                    usuarioSeleccionado.matriculaOriginal = usuarioSeleccionado.matricula;
                }

                const actualUrlParametros = `${BASE_PATH}${actualizarURoute}`;

                const response = await axios.patch(actualUrlParametros, usuarioActualizado, {
                    headers: {
                        Authorization: token,
                    },
                });

                if (usuarioSeleccionado !== null && usuarioSeleccionado.matriculaOriginal !== undefined && usuarioSeleccionado.matriculaOriginal !== "") {
                    const response1 = await axios.patch(actualUrlParametros, usuarioSeleccionado, {
                        headers: {
                            Authorization: token,
                        },
                    });
                    console.log(response1.data);
                }

                console.log(response.data);

                setShowCerrandoSesion(false);
            } catch (error) {
                console.error(error);
                setShowCerrandoSesion(false);
                setErrorMensaje("Ocurrió un error al actualizar el usuario.");
                setShowAlerta(true);
            }
        } else {
            setErrorMensaje("La matrícula es incorrecta.");
            setShowAlerta(true);
        }

        setShowModal(false);
    };

    const fetchUsuarios = async () => {
        try {
            const urlUsuarioAP = `${BASE_PATH}${usuarioAPRoute}`;
            const response = await axios.get(urlUsuarioAP, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setUsuariosAP(response.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }

    };

    const handleUsuarioSeleccionado = (usuario) => {
        if (usuarioSeleccionado === usuario) {
            setUsuarioSeleccionado(null);
        } else {
            setUsuarioSeleccionado(usuario);
        }
    };

    return (
        <>
            <MargenA />
            <Container>
                <h1 className="text-center mt-5">Editar Usuario</h1>
                <Alert variant="danger" show={showAlerta} onClose={() => setShowAlerta(false)} dismissible>
                    {errorMensaje}
                </Alert>
                <ListGroup variant="flush" className="mt-4 custom-list">
                    <div className="custom-list-item">
                        <button
                            className={`custom-button${campoSeleccionado === "matriculaCambio" ? " active" : ""}`}
                            onClick={() => handleCampoSeleccionado("matriculaCambio")}
                        >
                            Matrícula
                        </button>
                        {campoSeleccionado === "matriculaCambio" && (
                            <input
                                type="number"
                                name="matriculaCambio"
                                value={usuario.matriculaCambio}
                                onChange={handleChange}
                                placeholder="Ingresar matrícula"
                                className="form-control mb-3"
                            />
                        )}
                    </div>
                    <div className="custom-list-item">
                        <button
                            className={`custom-button${campoSeleccionado === "nombre" ? " active" : ""}`}
                            onClick={() => handleCampoSeleccionado("nombre")}
                        >
                            Nombre
                        </button>
                        {campoSeleccionado === "nombre" && (
                            <input
                                type="text"
                                name="nombre"
                                value={usuario.nombre}
                                onChange={handleChange}
                                placeholder="Ingresar nombre(s)"
                                className="form-control mb-3"
                            />
                        )}
                    </div>
                    <div className="custom-list-item">
                        <button
                            className={`custom-button${campoSeleccionado === "apellido_paterno" ? " active" : ""}`}
                            onClick={() => handleCampoSeleccionado("apellido_paterno")}
                        >
                            Apellido paterno
                        </button>
                        {campoSeleccionado === "apellido_paterno" && (
                            <input
                                type="text"
                                name="apellido_paterno"
                                value={usuario.apellido_paterno}
                                onChange={handleChange}
                                placeholder="Ingresar apellido paterno"
                                className="form-control mb-3"
                            />
                        )}
                    </div>
                    <div className="custom-list-item">
                        <button
                            className={`custom-button${campoSeleccionado === "apellido_materno" ? " active" : ""}`}
                            onClick={() => handleCampoSeleccionado("apellido_materno")}
                        >
                            Apellido materno
                        </button>
                        {campoSeleccionado === "apellido_materno" && (
                            <input
                                type="text"
                                name="apellido_materno"
                                value={usuario.apellido_materno}
                                onChange={handleChange}
                                placeholder="Ingresar apellido materno"
                                className="form-control mb-3"
                            />
                        )}
                    </div>
                    <div className="custom-list-item">
                        <button
                            className={`custom-button${campoSeleccionado === "plantel" ? " active" : ""}`}
                            onClick={() => handleCampoSeleccionado("plantel")}
                        >
                            Plantel
                        </button>
                        {campoSeleccionado === "plantel" && (
                            <Form.Select
                                name="plantel"
                                value={usuario.plantel}
                                onChange={handleChange}
                                className="mb-3"
                            >
                                <option value="">Seleccionar plantel</option>
                                <option value="A">Atizapán</option>
                                <option value="E">Ecatepec</option>
                                <option value="V">HAVRE</option>
                                <option value="X">Ixtapaluca</option>
                                <option value="I">Iztapalapa</option>
                                <option value="R">Los Reyes</option>
                                <option value="N">NEZA</option>
                                <option value="T">Toluca</option>
                                <option value="S">Toreo</option>
                                <option value="Z">Zona Rosa</option>
                                <option value="C">COACALCO</option>
                                <option value="U">CUAUTITLAN</option>
                                <option value="H">CHALCO</option>
                            </Form.Select>
                        )}
                    </div>
                    <div className="custom-list-item">
                        <button
                            className={`custom-button${campoSeleccionado === "correo" ? " active" : ""}`}
                            onClick={() => handleCampoSeleccionado("correo")}
                        >
                            Correo
                        </button>
                        {campoSeleccionado === "correo" && (
                            <input
                                type="text"
                                name="correo"
                                value={usuario.correo}
                                onChange={handleChange}
                                placeholder="Ingresar correo"
                                className="form-control mb-3"
                            />
                        )}
                    </div>
                    <div className="custom-list-item">
                        <button
                            className={`custom-button${campoSeleccionado === "password" ? " active" : ""}`}
                            onClick={() => handleCampoSeleccionado("password")}
                        >
                            Contraseña
                        </button>
                        {campoSeleccionado === "password" && (
                            <>
                                <input
                                    type="password"
                                    name="password"
                                    value={usuario.password}
                                    onChange={handleChange}
                                    placeholder="Ingresar contraseña"
                                    className="form-control mb-3"
                                />
                                {errorMensaje === "Contraseña válida" && (
                                    <span className="password-valid-message">Contraseña válida</span>
                                )}
                            </>
                        )}
                    </div>
                    <div className="custom-list-item">
                        <button
                            className={`custom-button${campoSeleccionado === "rol" ? " active" : ""}`}
                            onClick={() => handleCampoSeleccionado("rol")}
                            style={{
                                color: 'red'
                            }}
                        >
                            CEDER EL CARGO DE ADMINISTRADOR
                        </button>
                        {campoSeleccionado === "rol" && (
                            <Card>
                                <Card.Header>
                                    <Card.Title className="text-center">Seleccionar al nuevo Administrador</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <ListGroup>
                                        {usuariosAP.map((usuario) => (
                                            <ListGroup.Item
                                                key={usuario.matricula}
                                                onClick={() => handleUsuarioSeleccionado(usuario)}
                                                active={usuarioSeleccionado === usuario}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {usuario.nombre}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card.Body>
                                <Card.Footer></Card.Footer>
                            </Card>
                        )}
                    </div>
                    <div className="custom-list-item d-flex justify-content-center">
                        <Button
                            className="btn-primary"
                            onClick={handleActualizar}
                        >
                            Actualizar
                        </Button>
                    </div>
                </ListGroup>
            </Container>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Matrícula</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="number"
                        name="matriculaOriginal"
                        value={usuario.matriculaOriginal}
                        onChange={handleChange}
                        placeholder="Ingresar matrícula actual"
                        className="form-control mb-3"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleConfirmacion}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            {showCerrandoSesion && (
                <div className="cerrando-sesion">
                    Cerrando sesión...
                </div>
            )}
        </>
    );
};

export default EditarUsuarioForm;

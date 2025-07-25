import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import Pagination from 'react-bootstrap/Pagination';
import { useUFuctions } from './UFuctions';

export default function User() {
    const {
        usuario,
        abrir,
        alerta,
        confirmarAbrir,
        setConfirmarAbrir,
        seleccionarUsuarioId,
        exitoDialogoAbierto,
        setExitoDialogoAbierto,
        ActualizarUsuario,
        handleCerrar,
        GuardarCambios,
        EliminarUsuario,
        confirmarEliminarUsuario,
        handleClickFila,
        handleCambio,
        seleccionarUsuario,
        usuariosPaginados,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceFin,
        buscarUsuarioPorMatricula,
        setMatriculaBusqueda,
        matriculaBusqueda,
        plantelNombres,
        handleCambioSelect
    } = useUFuctions();

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h3 className="ad">Usuarios</h3>
                <Pagination>
                    <Pagination.Prev onClick={irAPaginaAnterior} disabled={paginaActual === 1} />
                    <Pagination.Next onClick={irAPaginaSiguiente} disabled={indiceFin >= usuario.length} />
                </Pagination>
            </Card.Header>
            <div className="container d-flex justify-content-center m-4 align-items-center">
                <Form.Group controlId="matriculaBusqueda">
                    <Form.Control
                        type="text"
                        value={matriculaBusqueda}
                        onChange={(e) => setMatriculaBusqueda(e.target.value)}
                        placeholder='Matrícula'
                    />
                </Form.Group>
                <Button variant="primary" onClick={() => buscarUsuarioPorMatricula(matriculaBusqueda)}>
                    Buscar
                </Button>
            </div>
            <Card.Body style={{ overflow: 'auto' }}>
                <table className="tabla">
                    <thead>
                        <tr>
                            <th className="columna">Matrícula</th>
                            <th className="columna">Nombre</th>
                            <th className="columna">Apellido paterno</th>
                            <th className="columna">Apellido materno</th>
                            <th className="columna">Plantel</th>
                            <th className="columna">Correo</th>
                            <th className="columna">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosPaginados &&
                            usuariosPaginados.map((usuario) => (
                                <tr
                                    key={usuario.matricula}
                                    className={seleccionarUsuarioId === usuario.matricula ? 'selected' : ''}
                                    onClick={() => handleClickFila(usuario)}
                                >
                                    <td className="columna">{usuario.matricula}</td>
                                    <td className="columna">{usuario.nombre}</td>
                                    <td className="columna">{usuario.apellido_paterno}</td>
                                    <td className="columna">{usuario.apellido_materno}</td>
                                    <td className="columna">{plantelNombres[usuario.plantel]}</td>
                                    <td className="columna">{usuario.correo}</td>
                                    <td className="columna">{usuario.rol === 'U' ? 'Usuario' : usuario.rol}</td>
                                    <td className="columna">{usuario.grupos.join(', ')}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
                <Button
                    variant="warning"
                    onClick={() => ActualizarUsuario(seleccionarUsuario)}
                    disabled={!seleccionarUsuario}
                >
                    Editar
                </Button>
                <Button variant="danger" onClick={EliminarUsuario} disabled={!seleccionarUsuario}>
                    Eliminar
                </Button>
                {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}
            </Card.Footer>
            <Modal show={abrir} onHide={handleCerrar}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group htmlFor="nombre">
                            <Form.Label>Nombre(s):</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={seleccionarUsuario ? seleccionarUsuario.nombre : ''}
                                onChange={handleCambio}
                            />
                        </Form.Group>
                        <Form.Group htmlFor="apellido_paterno">
                            <Form.Label>Apellido paterno:</Form.Label>
                            <Form.Control
                                type="text"
                                name="apellido_paterno"
                                value={seleccionarUsuario ? seleccionarUsuario.apellido_paterno : ''}
                                onChange={handleCambio}
                            />
                        </Form.Group>
                        <Form.Group htmlFor="apellido_materno">
                            <Form.Label>Apellido materno:</Form.Label>
                            <Form.Control
                                type="text"
                                name="apellido_materno"
                                value={seleccionarUsuario ? seleccionarUsuario.apellido_materno : ''}
                                onChange={handleCambio}
                            />
                        </Form.Group>
                        <Form.Group htmlFor="plantel">
                            <Form.Label>Plantel:</Form.Label>
                            <Form.Control
                                as="select"
                                value={seleccionarUsuario ? seleccionarUsuario.plantel : ''}
                                onChange={(e) => handleCambioSelect(e, 'plantel')}
                            >
                                <option value="">Seleccionar plantel</option>
                                {Object.entries(plantelNombres).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group htmlFor="correo">
                            <Form.Label>Correo:</Form.Label>
                            <Form.Control
                                type="text"
                                id="correo"
                                name="correo"
                                value={seleccionarUsuario ? seleccionarUsuario.correo : ''}
                                onChange={handleCambio}
                            />
                        </Form.Group>
                        <Form.Group htmlFor="rol">
                            <Form.Label>Rol:</Form.Label>
                            <Form.Control
                                as="select"
                                value={seleccionarUsuario ? seleccionarUsuario.rol : ''}
                                onChange={(e) => handleCambioSelect(e, 'rol')}
                            >
                                <option value="">Seleccionar</option>
                                <option value="AP">Administrador de apoyo</option>
                                <option value="C">Consultor</option>
                                <option value="U">Usuario</option>
                            </Form.Control> {/* Agrega esta línea */}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="success" onClick={GuardarCambios}>
                        Guardar
                    </Button>
                    <Button variant="danger" onClick={handleCerrar}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={confirmarAbrir} onHide={() => setConfirmarAbrir(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmarAbrir(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmarEliminarUsuario}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={exitoDialogoAbierto} onHide={() => setExitoDialogoAbierto(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Usuario actualizado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>El usuario se ha actualizado correctamente.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setExitoDialogoAbierto(false)} variant="primary">
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

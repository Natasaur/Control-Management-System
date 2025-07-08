import React from 'react';
import { Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import './CSS/Inicio.css';
import { useCFuctions } from './CFuctions';

export default function Con() {
    const {
        usuario,
        gruposDisponibles,
        seleccionarUsuarioId,
        seleccionarUsuario,
        abierto,
        confirmarEliminarModal,
        ActualizarUsuario,
        cerrarModal,
        GuardarCambios,
        ConfirmarEliminarUsuario,
        handleClickFila,
        handleCambioTexto,
        handleCambio,
        exitoDialogoAbierto,
        setExitoDialogoAbierto,
        setAbiertoConfirmar,
        abiertoConfirmar,
        alerta,
        usuariosPaginados,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceFin,
        handleCambioSelect,
        plantelNombres,
        buscarUsuarioPorMatricula,
        setMatriculaBusqueda,
        matriculaBusqueda
    } = useCFuctions();

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h3 className="ad">Consultores</h3>
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
                            <th className="columna">Grupos</th>
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
                                    <td className="columna">{usuario.rol === 'C' ? 'Consultor' : usuario.rol}</td>
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
                <Button
                    className="delete"
                    variant="danger"
                    onClick={confirmarEliminarModal}
                    disabled={!seleccionarUsuario}
                >
                    Eliminar
                </Button>
                {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}
            </Card.Footer>
            <Modal show={abierto} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="nombre">
                            <Form.Label>Nombre(s):</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={seleccionarUsuario ? seleccionarUsuario.nombre : ''}
                                onChange={handleCambioTexto}
                            />
                        </Form.Group>
                        <Form.Group controlId="apellido_paterno">
                            <Form.Label>Apellido paterno:</Form.Label>
                            <Form.Control
                                type="text"
                                name="apellido_paterno"
                                value={seleccionarUsuario ? seleccionarUsuario.apellido_paterno : ''}
                                onChange={handleCambioTexto}
                            />
                        </Form.Group>
                        <Form.Group controlId="apellido_materno">
                            <Form.Label>Apellido materno:</Form.Label>
                            <Form.Control
                                type="text"
                                name="apellido_materno"
                                value={seleccionarUsuario ? seleccionarUsuario.apellido_materno : ''}
                                onChange={handleCambioTexto}
                            />
                        </Form.Group>
                        <Form.Group controlId="plantel">
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
                        <Form.Group controlId="correo">
                            <Form.Label>Correo:</Form.Label>
                            <Form.Control
                                type="text"
                                name="correo"
                                value={seleccionarUsuario ? seleccionarUsuario.correo : ''}
                                onChange={handleCambioTexto}
                            />
                        </Form.Group>
                        <Form.Group controlId="rol">
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
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="grupos">
                            <Form.Label>Grupos:</Form.Label>
                            {seleccionarUsuario &&
                                gruposDisponibles.map((grupo) => (
                                    <Form.Check
                                        key={grupo}
                                        type="checkbox"
                                        id={grupo}
                                        label={grupo}
                                        name={grupo}
                                        checked={seleccionarUsuario.grupos.includes(grupo)}
                                        onChange={handleCambio}
                                    />
                                ))}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button onClick={GuardarCambios} type="submit" variant="success" className="mr-2">
                        Guardar
                    </Button>
                    <Button onClick={cerrarModal} type="button" variant="danger">
                        Cancelar
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
            <Modal show={abiertoConfirmar} onHide={() => setAbiertoConfirmar(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setAbiertoConfirmar(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={ConfirmarEliminarUsuario}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

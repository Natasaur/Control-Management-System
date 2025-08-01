import React from 'react';
import { Button, Modal, Card } from 'react-bootstrap';
import { useTablaVA } from './TablaVAFunctios';
//import CrearUnicoAlumno from './CrearUnicoAlumno';
import Pagination from 'react-bootstrap/Pagination';

export function TablaVA() {
    const {
        usuarios,
        usuarioSeleccionado,
        dialogoConfirmacionAbierto,
        dialogoEdicionAbierto,
        usuarioEditado,
        usuarioActualizado,
        manejarSeleccionUsuario,
        manejarCancelarEliminarUsuario,
        manejarEditarUsuario,
        manejarCancelarActualizarUsuario,
        manejarCambio,
        manejarActualizarUsuario,
        cerrarAlertaUsuarioActualizado,
        manejarEliminarUsuario,
        mostrarConfirmacionEliminar,
        usuariosPaginados,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceFin,
        setBusqueda,
        busqueda
    } = useTablaVA();

    return (
        <Card>
            <div>
                <h3 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Tabla de alumnos</h3>
            </div>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Pagination>
                    <Pagination.Prev onClick={irAPaginaAnterior} disabled={paginaActual === 1} />
                    <Pagination.Next onClick={irAPaginaSiguiente} disabled={indiceFin >= usuarios.length} />
                </Pagination>
            </Card.Header>
            <Card.Body>
                <input
                    type="text"
                    placeholder="Buscar matrícula"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="form-control"
                />
                <div style={{ overflow: 'auto' }}>
                    {usuarios.length === 0 ? (
                        <p>Cargando datos...</p>
                    ) : (
                        usuariosPaginados.length === 0 ? (
                            <p>No se encontraron alumnos.</p>
                        ) : (
                            <table className="tabla" style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Matrícula</th>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Apellido paterno</th>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Apellido materno</th>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Grupo</th>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Ciclo escolar</th>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Contacto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosPaginados.map((usuario) => (
                                        <tr
                                            key={usuario.matricula}
                                            className={usuarioSeleccionado === usuario ? 'selected' : ''}
                                            onClick={() => manejarSeleccionUsuario(usuario)}
                                            style={{ border: '1px solid #ccc' }}
                                        >
                                            <td className="columna" style={{ padding: '8px' }}>{usuario.matricula}</td>
                                            <td className="columna" style={{ padding: '8px' }}>{usuario.nombre}</td>
                                            <td className="columna" style={{ padding: '8px' }}>{usuario.apellido_paterno}</td>
                                            <td className="columna" style={{ padding: '8px' }}>{usuario.apellido_materno}</td>
                                            <td className="columna" style={{ padding: '8px' }}>{usuario.grupo}</td>
                                            <td className="columna" style={{ padding: '8px' }}>{usuario.ciclo_escolar}</td>
                                            <td className="columna" style={{ padding: '8px' }}>{usuario.contacto}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        ))}
                </div>
            </Card.Body>
            <Card.Footer>
                <Modal show={dialogoConfirmacionAbierto} onHide={manejarCancelarEliminarUsuario}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar eliminación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Estás seguro de que deseas eliminar al alumno seleccionado?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={manejarCancelarEliminarUsuario}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={manejarEliminarUsuario}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={dialogoEdicionAbierto} onHide={manejarCancelarActualizarUsuario}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar alumno</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="formulario">
                            <div className="form-group">
                                <label htmlFor="matricula">Matrícula:</label>
                                <input
                                    type="text"
                                    id="matricula"
                                    name="matricula"
                                    value={usuarioEditado?.matricula || ''}
                                    onChange={manejarCambio}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={usuarioEditado.nombre || ''}
                                    onChange={manejarCambio}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido_paterno">Apellido Paterno:</label>
                                <input
                                    type="text"
                                    id="apellido_paterno"
                                    name="apellido_paterno"
                                    value={usuarioEditado.apellido_paterno || ''}
                                    onChange={manejarCambio}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido_materno">Apellido Materno:</label>
                                <input
                                    type="text"
                                    id="apellido_materno"
                                    name="apellido_materno"
                                    value={usuarioEditado.apellido_materno || ''}
                                    onChange={manejarCambio}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="grupo">Grupo:</label>
                                <input
                                    type="text"
                                    id="grupo"
                                    name="grupo"
                                    value={usuarioEditado.grupo || ''}
                                    onChange={manejarCambio}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ciclo_escolar">Ciclo escolar:</label>
                                <input
                                    type="text"
                                    id="ciclo_escolar"
                                    name="ciclo_escolar"
                                    value={usuarioEditado.ciclo_escolar || ''}
                                    onChange={manejarCambio}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contacto">Contacto:</label>
                                <input
                                    type="email"
                                    id="contacto"
                                    name="contacto"
                                    value={usuarioEditado.contacto || ''}
                                    onChange={manejarCambio}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={manejarCancelarActualizarUsuario}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={manejarActualizarUsuario}>
                            Actualizar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={usuarioActualizado} onHide={cerrarAlertaUsuarioActualizado}>
                    <Modal.Header closeButton>
                        <Modal.Title>Alumno actualizado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>El alumno ha sido actualizado correctamente.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={cerrarAlertaUsuarioActualizado}>
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button variant="warning" onClick={manejarEditarUsuario} disabled={!usuarioSeleccionado}>
                        Editar
                    </Button>
                    {/*<CrearUnicoAlumno />*/}
                    <Button variant="danger" onClick={mostrarConfirmacionEliminar} disabled={!usuarioSeleccionado}>
                        Eliminar
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
}
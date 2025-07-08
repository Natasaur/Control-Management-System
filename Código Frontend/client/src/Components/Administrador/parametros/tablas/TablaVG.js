import React, { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useTablaVG } from './TablaVGFunctions';
import CrearUnicoGrupo from '../individual/CrearUnicoGrupo';
import Pagination from 'react-bootstrap/Pagination';

export function TablaVG() {
    const {
        grupos,
        gruposSeleccionado,
        manejarSeleccionGrupo,
        valoresEditados,
        setValoresEditados,
        modalAbierto,
        dialogoConfirmacionAbierto,
        setDialogoConfirmacionAbierto,
        abrirModalEditar,
        cerrarModalEditar,
        mostrarConfirmacionEliminar,
        confirmarEliminarGrupo,
        guardarCambios,
        gruposPaginados,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceFin,
        setBusqueda,
        busqueda
    } = useTablaVG();

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h3 className="ad">Tabla de grupos</h3>
                <Pagination>
                    <Pagination.Prev onClick={irAPaginaAnterior} disabled={paginaActual === 1} />
                    <Pagination.Next onClick={irAPaginaSiguiente} disabled={indiceFin >= grupos.length} />
                </Pagination>
            </Card.Header>
            <Card.Body>
                <div className="box-p-11">
                    <input
                        type="text"
                        placeholder="Buscar grupo"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="form-control"
                    />
                    {grupos.length === 0 ? (
                        <p>Cargando datos...</p>
                    ) : (
                        gruposPaginados.length === 0 ? (
                            <p>No se encontraron grupos.</p>
                        ) : (
                            <table className="tabla" style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Grupo</th>
                                        <th className="columna" style={{ border: '1px solid #ccc', padding: '8px' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gruposPaginados.map((grupo, index) => (
                                        <tr
                                            key={index}
                                            className={grupo.grupo === gruposSeleccionado?.grupo ? 'selected' : ''}
                                            onClick={() => manejarSeleccionGrupo(grupo)}
                                            style={{ border: '1px solid #ccc' }}
                                        >
                                            <td className="columna" style={{ padding: '8px' }}>{grupo.grupo}</td>
                                            <td className="columna" style={{ padding: '8px' }}>{grupo.disponible ? 'Disponible' : 'Ocupado'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ))}
                </div>
            </Card.Body>
            <Card.Footer>
                <div className="box-p-10" style={{ maxWidth: '900px', maxHeight: '500px', margin: 'auto', overflow: 'auto' }}>
                    <Modal show={modalAbierto} onHide={cerrarModalEditar}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Grupo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form className="formulario">
                                <label htmlFor="matricula">Nombre del grupo:</label>
                                <input
                                    autoFocus
                                    margin="dense"
                                    id="grupo"
                                    label="Grupo"
                                    type="text"
                                    className="form-control"
                                    value={valoresEditados?.grupo || ''}
                                    onChange={(e) => {
                                        const nuevoGrupo = e.target.value.trim() !== '' ? e.target.value : null;
                                        setValoresEditados({ ...valoresEditados, grupo: nuevoGrupo });
                                    }}
                                />
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={cerrarModalEditar} variant="secondary">
                                Cancelar
                            </Button>
                            <Button onClick={guardarCambios} variant="primary">
                                Guardar Cambios
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={dialogoConfirmacionAbierto} onHide={() => setDialogoConfirmacionAbierto(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>¿Estás seguro de que deseas eliminar este grupo?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => setDialogoConfirmacionAbierto(false)} variant="secondary">
                                Cancelar
                            </Button>
                            <Button onClick={confirmarEliminarGrupo} variant="danger" autoFocus>
                                Eliminar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                        variant="warning"
                        onClick={abrirModalEditar}
                        disabled={!gruposSeleccionado}
                    >
                        Editar
                    </Button>
                    <CrearUnicoGrupo />
                    <Button
                        variant="danger"
                        onClick={mostrarConfirmacionEliminar}
                        disabled={!gruposSeleccionado}
                    >
                        Eliminar
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
}

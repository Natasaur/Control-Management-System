import React from 'react';
import { Card, ListGroup, Pagination, Button, Modal, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useVisualizarAFunctions from './VisualizarAFunctions';

export default function VisualizarA() {
    const {
        seleccionaFecha,
        asistencias,
        cambiarFecha,
        elementosActuales,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceUltimoElemento,
        showConfirmModal,
        handleEliminarAsistencia,
        handleCerrarModal,
        handleMostrarConfirmModal,
        mensajeEliminacion,
        obtenerAsistencias,
        isLoading 
    } = useVisualizarAFunctions();

    return (
        <Card>
            <Card.Header>
                <div>
                    <h3 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Visualizar asistencias</h3>
                </div>
                <p>Selecciona una fecha</p>
            </Card.Header>
            <Card.Body>
            <div className="d-flex justify-content-center align-items-center">
            <div className="mr-2">
                <DatePicker
                    selected={seleccionaFecha}
                    onChange={cambiarFecha}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker form-control mb-6"
                />
            </div>
            <div className="mr-9">
                <Button onClick={obtenerAsistencias}>Filtrar por fecha</Button>
            </div>

            {isLoading && <Spinner animation="border" variant="primary" />}

        </div>
                {mensajeEliminacion && <p>{mensajeEliminacion}</p>}
                <ListGroup className="box-c-8">
                    {elementosActuales.map((asistencia) => (
                        <ListGroup.Item key={asistencia._id} className="py-3">
                            <p className="m-0"><strong>Matrícula:</strong> {asistencia.matricula}</p>
                            <p className="m-0"><strong>Grupo:</strong> {asistencia.grupo}</p>
                            <p className="m-0"><strong>Ciclo escolar:</strong> {asistencia.ciclo_escolar}</p>
                            <p className="m-0"><strong>Fecha:</strong> {asistencia.fecha}</p>
                            <p className="m-0"><strong>Tipo de asistencia:</strong> {asistencia.tipo_asistencia}</p>
                            <Button variant="danger" onClick={() => handleMostrarConfirmModal(asistencia)}>Eliminar</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
            <Card.Footer>
                <Pagination className="mt-3 justify-content-end">
                    <Pagination.Prev onClick={irAPaginaAnterior} disabled={paginaActual === 1} />
                    <Pagination.Item active>{paginaActual}</Pagination.Item>
                    <Pagination.Next onClick={irAPaginaSiguiente} disabled={indiceUltimoElemento >= asistencias.length} />
                </Pagination>
            </Card.Footer>

            <Modal show={showConfirmModal} onHide={handleCerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas eliminar esta asistencia?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCerrarModal}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleEliminarAsistencia}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

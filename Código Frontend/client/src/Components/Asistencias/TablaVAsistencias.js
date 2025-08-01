import React from 'react';
import { Card, Table, Form, Button, Modal, Pagination, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useVisualizarAFunctions from './VisualizarAFunctions';
import { format } from 'date-fns';

export default function TablaAsistencias() {

    const formatearFecha = (fecha) => {
    if (!fecha) return '';
        try {
            return format(new Date(fecha), 'yyyy-MM-dd');
        } catch (error) {
            console.warn('Fecha inválida detectada:', fecha);
            return '';
        }
    };

    const {
        grupos,
        alumnos,
        matricula,
        setMatricula,
        grupo,
        setGrupo,
        tipo_asistencia,
        setTipoAsistencia,
        fechaInicio,
        fechaFin,
        setFechaInicio,
        setFechaFin,
        asistencias,
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
            <div>
                <h3 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Asistencias</h3>
            </div>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                        <Form.Label>Fecha Inicio</Form.Label>
                        <DatePicker
                            selected={fechaInicio}
                            onChange={setFechaInicio}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                        <Form.Label>Fecha Fin</Form.Label>
                        <DatePicker
                            selected={fechaFin}
                            onChange={setFechaFin}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                        <Form.Label>Tipo de Asistencia</Form.Label>
                        <Form.Select
                           value={tipo_asistencia}
                           onChange={(e) => setTipoAsistencia(e.target.value)}
                           className="form-control"
                           >
                           <option value="">Todas</option>
                           <option value="normal">Normal</option>
                           <option value="justificada">Justificada</option>
                        </Form.Select>
                        <Form.Select
                            value={grupo}
                            onChange={(e) => setGrupo(e.target.value)}
                        >
                            <option value="">Todos los grupos</option>
                            {grupos.map((g) => (
                                <option key={g._id} value={g.nombre}>
                                    {g.nombre}
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Select
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                        >
                            <option value="">Todas las matrículas</option>
                            {alumnos.map((a) => (
                                <option key={a._id} value={a.matricula}>
                                    {a.matricula} - {a.nombre}
                                </option>
                            ))}
                        </Form.Select>
                        <Button onClick={ () => obtenerAsistencias({ fechaInicio, fechaFin, tipo_asistencia, grupo, matricula })}>Filtrar</Button>
                        {isLoading && <Spinner animation="border" variant="primary" size="sm" className="ml-2" />}
                    </div>
                </div>
                <Pagination>
                  <Pagination.Item
                     onClick={irAPaginaAnterior}
                     disabled={paginaActual === 1}
                     style={{
                        fontSize: '3rem',
                        padding: '0.5rem 1rem',
                        cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                     }}
                  >
                     ‹
                  </Pagination.Item>

                  <Pagination.Item
                     onClick={irAPaginaSiguiente}
                     disabled={indiceUltimoElemento >= asistencias.length}
                     style={{
                        fontSize: '3rem',
                        padding: '0.5rem 1rem',
                        cursor: indiceUltimoElemento >= asistencias.length ? 'not-allowed' : 'pointer',
                     }}
                  >
                     ›
                  </Pagination.Item>
               </Pagination>
            </Card.Header>

            <Card.Body>
                {mensajeEliminacion && <p className="text-success">{mensajeEliminacion}</p>}

                {asistencias.length === 0 ? (
                    <p className="text-center">No hay asistencias registradas.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Matrícula</th>
                                    <th>Grupo</th>
                                    <th>Ciclo Escolar</th>
                                    <th>Fecha</th>
                                    <th>Tipo de Asistencia</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((asistencia) => (
                                    <tr key={asistencia._id}>
                                        <td>{asistencia.matricula}</td>
                                        <td>{asistencia.grupo}</td>
                                        <td>{asistencia.ciclo_escolar}</td>
                                        <td>{formatearFecha(asistencia.fecha)}</td>
                                        <td>{asistencia.tipo_asistencia}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleMostrarConfirmModal(asistencia)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card.Body>

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
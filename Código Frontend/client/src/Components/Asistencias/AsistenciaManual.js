import React from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import { useAsistenciaMFuctions } from './AsistenciasMFunctions';



export default function AsistenciaManual() {
    const {
        modalAbrir,
        valorFormulario,
        mensaje,
        mostrarModal,
        alerta,
        abrirModal,
        cerrarModal,
        manejarCambioEntrada,
        enviarFormulario,
        alternarModal
    } = useAsistenciaMFuctions();

    return (
        <div>
            <Button
                variant="success"
                style={{
                    color: '#FFFFFF',
                }}
                onClick={abrirModal}
            >
                Registrar Asistencia Justificada
            </Button>
            <Modal
                show={modalAbrir}
                onHide={cerrarModal}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ingrese los siguientes datos:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={enviarFormulario}>
                        <div className="mb-3">
                            <label htmlFor="Matricula" className="form-label">Matrícula del alumno</label>
                            <input
                                type="number"
                                id="Matricula"
                                name="Matricula"
                                value={valorFormulario.Matricula}
                                onChange={manejarCambioEntrada}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Grupo" className="form-label">Grupo</label>
                            <input
                                type="text"
                                id="Grupo"
                                name="Grupo"
                                value={valorFormulario.Grupo}
                                onChange={manejarCambioEntrada}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Ciclo" className="form-label">Ciclo escolar</label>
                            <input
                                type="text"
                                id="Ciclo"
                                name="Ciclo"
                                value={valorFormulario.Ciclo}
                                onChange={manejarCambioEntrada}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Fecha" className="form-label">Fecha</label>
                            <input
                                type="date"
                                id="Fecha"
                                name="Fecha"
                                value={valorFormulario.Fecha}
                                onChange={manejarCambioEntrada}
                                className="form-control"
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                variant="success"
                                className="btn btn-primary me-2"
                            >
                                Guardar
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={cerrarModal}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                    {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}
                    <Modal show={mostrarModal} onHide={alternarModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Asistencia cargada</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{mensaje}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={alternarModal}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Modal.Body>
            </Modal>
        </div>
    );
}

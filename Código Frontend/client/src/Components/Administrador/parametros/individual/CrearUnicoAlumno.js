import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import useCrearUAFuctions from './CrearUAFuctions';

export default function CrearUnicoAlumno() {
    const {
        modalAbrir,
        valorFormulario,
        abrirModal,
        cerrarModal,
        manejarCambioEntrada,
        enviarFormulario,
        mostrarAlerta,
        mensajeAlerta
    } = useCrearUAFuctions();
    return (
        <div>
            <Button
                style={{
                    color: '#FFFFFF',
                }}
                onClick={abrirModal}
            >
                <BsPlus />
            </Button>
            <Modal
                show={modalAbrir}
                onHide={cerrarModal}
                centered
                size="md"
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>Ingrese los siguientes datos:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={enviarFormulario}>
                        <input
                            type="number"
                            id="Matricula"
                            name="Matricula"
                            value={valorFormulario.Matricula}
                            onChange={manejarCambioEntrada}
                            placeholder="Matrícula del alumno"
                            className="form-control mb-3"
                        />
                        <input
                            type="text"
                            id="Nombre"
                            name="Nombre"
                            value={valorFormulario.Nombre}
                            onChange={manejarCambioEntrada}
                            placeholder="Nombre"
                            className="form-control mb-3"
                        />
                        <input
                            type="text"
                            id="Apellido_paterno"
                            name="Apellido_paterno"
                            value={valorFormulario.Apellido_paterno}
                            onChange={manejarCambioEntrada}
                            placeholder="Apellido paterno"
                            className="form-control mb-3"
                        />
                        <input
                            type="text"
                            id="Apellido_materno"
                            name="Apellido_materno"
                            value={valorFormulario.Apellido_materno}
                            onChange={manejarCambioEntrada}
                            placeholder="Apellido materno"
                            className="form-control mb-3"
                        />
                        <input
                            type="text"
                            id="Grupo"
                            name="Grupo"
                            value={valorFormulario.Grupo}
                            onChange={manejarCambioEntrada}
                            placeholder="Grupo"
                            className="form-control mb-3"
                        />
                        <input
                            type="text"
                            id="Ciclo_escolar"
                            name="Ciclo_escolar"
                            value={valorFormulario.Ciclo_escolar}
                            onChange={manejarCambioEntrada}
                            placeholder="Ciclo escolar"
                            className="form-control mb-3"
                        />
                        <input
                            type="text"
                            id="Contacto"
                            name="Contacto"
                            value={valorFormulario.Contacto}
                            onChange={manejarCambioEntrada}
                            placeholder="Contacto"
                            className="form-control mb-3"
                        />
                        {mostrarAlerta && <div style={{ color: 'red' }}>{mensajeAlerta}</div>}
                        <div className="d-flex justify-content-center mt-4">
                            <button
                                type="submit"
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
                </Modal.Body>
            </Modal>
        </div>
    );
}

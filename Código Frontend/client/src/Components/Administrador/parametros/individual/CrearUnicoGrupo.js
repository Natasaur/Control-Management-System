import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useTablaVG } from '../tablas/TablaVGFunctions';

export default function CrearUnicoGrupo() {
    const {
        modalAbierto,
        valorFromulario,
        abrirModal,
        cerrarModal,
        manejarCambioEntrada,
        enviarFormulario,
        mostrarAlerta,
        mensajeAlerta
    } = useTablaVG();
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
                show={modalAbierto}
                onHide={cerrarModal}
                backdrop="static"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>Ingrese el siguiente dato:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={enviarFormulario}>
                        <input
                            type="text"
                            id="Grupo"
                            name="Grupo"
                            value={valorFromulario.Grupo}
                            onChange={manejarCambioEntrada}
                            placeholder="Grupo"
                            className="form-control"
                        />
                        <br />
                        {mostrarAlerta && <div style={{ color: 'blue' }}>{mensajeAlerta}</div>}
                        <div className="d-flex justify-content-center">
                            <Button
                                type="submit"
                                variant="primary"
                                style={{ marginRight: '10px' }}
                            >
                                Guardar
                            </Button>
                            <Button
                                type="button"
                                variant="danger"
                                onClick={cerrarModal}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

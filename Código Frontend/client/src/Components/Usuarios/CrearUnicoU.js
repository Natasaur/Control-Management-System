import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import useCrearUSFuctions from './CrearUSFuctions';

export default function CrearUnicoU() {
    const {
        modalEstaAbierto,
        valoresFormulario,
        abrirModal,
        cerrarModal,
        manejarCambioInput,
        enviarFormulario,
        mostrarAlerta,
        mensajeAlerta,
    } = useCrearUSFuctions();

    return (
        <div className="box-u-5">
            {modalEstaAbierto && <div className="modal-overlay" onClick={cerrarModal}></div>}
            <Button
                variant="success"
                className={`agregar-button ${modalEstaAbierto ? 'hide' : ''}`}
                onClick={abrirModal}
            >
                Agregar
            </Button>
            <Modal show={modalEstaAbierto} onHide={cerrarModal} centered scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>Ingrese los siguientes datos:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={enviarFormulario}>
                        <div className="mb-3">
                            <label htmlFor="Matricula" className="form-label">Matrícula del usuario</label>
                            <input
                                type="number"
                                id="Matricula"
                                name="Matricula"
                                value={valoresFormulario.Matricula}
                                onChange={manejarCambioInput}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Nombre" className="form-label">Nombre</label>
                            <input
                                type="text"
                                id="Nombre"
                                name="Nombre"
                                value={valoresFormulario.Nombre}
                                onChange={manejarCambioInput}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Apellido_paterno" className="form-label">Apellido paterno</label>
                            <input
                                type="text"
                                id="Apellido_paterno"
                                name="Apellido_paterno"
                                value={valoresFormulario.Apellido_paterno}
                                onChange={manejarCambioInput}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Apellido_materno" className="form-label">Apellido materno</label>
                            <input
                                type="text"
                                id="Apellido_materno"
                                name="Apellido_materno"
                                value={valoresFormulario.Apellido_materno}
                                onChange={manejarCambioInput}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Plantel" className="form-label">Plantel</label>
                            <select
                                id="Plantel"
                                name="Plantel"
                                value={valoresFormulario.Plantel}
                                onChange={manejarCambioInput}
                                className="form-select"
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
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Correo" className="form-label">Correo</label>
                            <input
                                type="text"
                                id="Correo"
                                name="Correo"
                                value={valoresFormulario.Correo}
                                onChange={manejarCambioInput}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Rol" className="form-label">Rol</label>
                            <select
                                id="Rol"
                                name="Rol"
                                value={valoresFormulario.Rol}
                                onChange={manejarCambioInput}
                                className="form-select"
                            >
                                <option value="">Seleccione un rol</option>
                                <option value="AP">Administrador de apoyo</option>
                                <option value="C">Consultor</option>
                                <option value="U">Usuario</option>
                            </select>
                        </div>

                        {mostrarAlerta && <div style={{ color: 'red' }}>{mensajeAlerta}</div>}
                        <div className="d-flex justify-content-center">
                            <Button type="submit" variant="success" className="mr-2">Guardar</Button>
                            <Button type="button" variant="danger" onClick={cerrarModal}>Cancelar</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

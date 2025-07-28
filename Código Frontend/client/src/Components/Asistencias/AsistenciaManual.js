import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAsistenciaMFuctions } from './AsistenciasMFunctions';

export default function AsistenciaManual() {
    const {
        valorFormulario,
        mensaje,
        mostrarModal,
        alerta,
        manejarCambioEntrada,
        enviarFormulario,
        alternarModal
    } = useAsistenciaMFuctions();

    return (
        <div className="container mt-4">
            <div>
                <h3 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Registrar Asistencia Justificada</h3>
            </div>
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
                        className="btn btn-primary me-2"
                    >
                        Guardar
                    </button>
                </div>
            </form>

            {alerta && <Alert variant={alerta.tipo} className="mt-3">{alerta.mensaje}</Alert>}

            {mostrarModal && (
                <Alert variant="success" className="mt-3" dismissible onClose={alternarModal}>
                    {mensaje}
                </Alert>
            )}
        </div>
    );
}
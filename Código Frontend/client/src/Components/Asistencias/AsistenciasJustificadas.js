import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAsistenciaJFuctions } from '../Consultor/Asistencias/AsistenciasJfuctions';

export default function AsistenciManual() {
    const {
        valorFormulario,
        mensaje,
        alerta,
        manejarCambioEntrada,
        enviarFormulario
    } = useAsistenciaJFuctions();

    return (
        <div className="container mt-4">
            <h3>Registrar Asistencia Justificada</h3>
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

                {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}
                

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary me-2">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}
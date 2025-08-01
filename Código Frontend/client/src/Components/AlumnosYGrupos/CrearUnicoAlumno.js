import React from 'react';
import useCrearUAFuctions from './CrearUAFuctions';

export default function CrearUnicoAlumno() {
    const {
        //modalAbrir,
        valorFormulario,
        //abrirModal,
        //cerrarModal,
        manejarCambioEntrada,
        enviarFormulario,
        mostrarAlerta,
        mensajeAlerta
    } = useCrearUAFuctions();

    return (
        <div className="container mt-4">
            <div>
                <h3 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Registro de alumno</h3>
            </div>
            <form onSubmit={enviarFormulario}>
                <input
                    type="number"
                    name="Matricula"
                    value={valorFormulario.Matricula}
                    onChange={manejarCambioEntrada}
                    placeholder="Matrícula del alumno"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    name="Nombre"
                    value={valorFormulario.Nombre}
                    onChange={manejarCambioEntrada}
                    placeholder="Nombre"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    name="Apellido_paterno"
                    value={valorFormulario.Apellido_paterno}
                    onChange={manejarCambioEntrada}
                    placeholder="Apellido paterno"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    name="Apellido_materno"
                    value={valorFormulario.Apellido_materno}
                    onChange={manejarCambioEntrada}
                    placeholder="Apellido materno"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    name="Grupo"
                    value={valorFormulario.Grupo}
                    onChange={manejarCambioEntrada}
                    placeholder="Grupo"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    name="Ciclo_escolar"
                    value={valorFormulario.Ciclo_escolar}
                    onChange={manejarCambioEntrada}
                    placeholder="Ciclo escolar"
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    name="Contacto"
                    value={valorFormulario.Contacto}
                    onChange={manejarCambioEntrada}
                    placeholder="Contacto"
                    className="form-control mb-3"
                />
                <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={manejarCambioEntrada}
                    className="form-control mb-3"
                />
                {mostrarAlerta && (
                    <div className="alert alert-info text-center">{mensajeAlerta}</div>
                )}
                <div className="d-flex justify-content-center mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary me-2"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}

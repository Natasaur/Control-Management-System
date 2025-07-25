import React from 'react';
import { Card } from 'react-bootstrap';
import MargenConsultor from '../Extras/MargenConsultor';
import CsvTabla from '../Consultor/Tabla/Tabla';
import AsistenciManual from './Asistencias/AsistenciaManual';
import AsistenciaJustificada from './Asistencias/AsistenciasJustificadas';
import VisualizarA from './Asistencias/VisualizarA';

export default function Consultor() {
    return (
        <>
            <MargenConsultor />
            <div>
                <h2 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Inicio</h2>
            </div>
            <div className="container my-4">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Cargar manualmente a un alumno</Card.Title>
                                        <Card.Text>
                                            En esta sección, podrás llenar un formulario para ingresar los datos de un único alumno.
                                        </Card.Text>
                                        <AsistenciManual />
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-md-6 mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Cargar manualmente a un alumno con falta justificada</Card.Title>
                                        <Card.Text>
                                            En esta sección, podrás llenar un formulario para ingresar los datos de un alumno con falta justificada.
                                        </Card.Text>
                                        <AsistenciaJustificada />
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-md-7 mb-4">
                                <CsvTabla />
                            </div>
                            <div className="col-md-5 mb-4">
                                <VisualizarA />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
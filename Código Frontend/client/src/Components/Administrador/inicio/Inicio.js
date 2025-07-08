import React from 'react';
import { Card } from 'react-bootstrap';
import Margen from '../../Extras/MargenAP';
import CsvTabla from './Tabla';
import TablaV from './TablaV';
import CrearUnicoU from './CrearUnicoUsario/CrearUnicoU';
import Con from './Usuarios/C';
import User from './Usuarios/U';

export default function Inicio() {
    return (
        <>
            <Margen />
            <div>
                <h2 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Administración de usuarios</h2>
            </div>
            <div className="container my-4">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="row">
                            <div className="col-md-12 mb-4">
                                <CsvTabla />
                            </div>
                            <div className="col-md-12 mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Cargar un único usuario</Card.Title>
                                        <Card.Text>
                                            En esta sección, podrás llenar un formulario para ingresar los datos de un único usuario.
                                        </Card.Text>
                                        <CrearUnicoU />
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-15 mb-4">
                                <TablaV />
                            </div>
                            <div className="col-md-15 mb-4">
                                <Con />
                            </div>
                            <div className="col-md-15 mb-4">
                                <User />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

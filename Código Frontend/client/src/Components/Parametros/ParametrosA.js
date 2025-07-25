import React from 'react';
import Calendario from './Calendario';
import { TablaAlumnos, TablaGrupos, TablaVA, TablaVG } from '../parametros/tablas';
import MargenA from '../Extras/MargenA';

export default function ParametroA() {
    return (
        <>
            <MargenA />
            <div>
                <h2 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Administración de parámetros</h2>
            </div>
            <div className="container my-4">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="row">
                            <div className="col-md-8 mb-4">
                                <TablaAlumnos />
                            </div>
                            <div className="col-md-4 mb-4">
                                <TablaGrupos />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <Calendario />
                            </div>
                            <div className="col-md-8 mb-4">
                                <TablaVG />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-15 mb-4">
                                <TablaVA />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

import React from 'react';
import Calendario from './Calendario';

export default function Parametro() {
    return (
        <>
            {/*<Margen />*/}
            <div>
                <h2 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Administración de parámetros</h2>
            </div>
            <div className="container my-4">
                <Calendario />
            </div>
        </>
    );
}

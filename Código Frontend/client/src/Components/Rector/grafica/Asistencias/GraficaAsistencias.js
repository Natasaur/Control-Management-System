import React, { useEffect, useState } from 'react';
import api from '../../../../api/axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Spinner, Alert } from 'react-bootstrap';

export default function GraficaAsistencias({ grupo, fechaInicio, fechaFin }) {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function convertirFecha(fecha) {
        const d = new Date(fecha);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const anio = d.getFullYear();
        return `${dia}/${mes}/${anio}`;
    }
    
    useEffect(() => {
        const fetchDatos = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.post('/asistencia/buscar/resumen/grupo', {
                    grupo,
                    fecha_inicio: convertirFecha(fechaInicio),
                    fecha_fin: convertirFecha(fechaFin)
                });
                console.log(response)
                console.log("Datos recibidos:", response.data);

                // TEMPORAL PARA PROBAR LA GRÁFICA
                /*setDatos([
                { fecha: "2025-07-01", asistencias: 10, faltas: 2 },
                { fecha: "2025-07-02", asistencias: 12, faltas: 1 },
                { fecha: "2025-07-03", asistencias: 9, faltas: 4 },
                ]);*/

                setDatos(response.data.dias);
            } catch (err) {
                setError('Error al cargar datos de asistencias');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDatos();
    }, [grupo, fechaInicio, fechaFin]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (datos.length === 0) {
        return <Alert variant="warning">No hay datos disponibles para mostrar.</Alert>;
    }


    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datos} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="asistencias" fill="#82ca9d" name="Asistencias" />
                <Bar dataKey="faltas" fill="#ff6961" name="Faltas" />
            </BarChart>
        </ResponsiveContainer>
    );
}
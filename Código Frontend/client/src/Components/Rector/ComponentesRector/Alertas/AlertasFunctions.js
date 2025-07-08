// AlertasFunctions.js
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../../../utils/Constants';

export function AlertasFunctions() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteAP = ENV.API_ROUTES.wgJgf1yyn1D3yYNQ0Z802IAdy517MosAP;
    const [alertas, setAlertas] = useState([]);
    const token = Cookies.get('token');
    const [plantelSeleccionado, setPlantelSeleccionado] = useState('');
    const [semanaSeleccionada, setSemanaSeleccionada] = useState('');
    const [mostrarBotonDescarga, setMostrarBotonDescarga] = useState(false);

    const obtenerAlertas = async () => {
        try {
            if (plantelSeleccionado && semanaSeleccionada) {
                const urlAP = `${BASE_PATH}${RouteAP}`;
                const requestData = {
                    semana: semanaSeleccionada,
                    plantel: plantelSeleccionado,
                };
                console.log(requestData);
                const response = await axios.post(urlAP, requestData, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                console.log(response);
                const alumnosSinAsistencias = response.data;
                setAlertas(alumnosSinAsistencias);
                setMostrarBotonDescarga(true);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const manejarCambio = (event) => {
        const seleccion = event.target.value;
        setPlantelSeleccionado(seleccion);
    };

    const manejarCambioSemana = (event) => {
        const seleccion = event.target.value;
        setSemanaSeleccionada(seleccion);
    };

    return {
        alertas,
        mostrarBotonDescarga,
        obtenerAlertas,
        manejarCambio,
        manejarCambioSemana,
    };
}

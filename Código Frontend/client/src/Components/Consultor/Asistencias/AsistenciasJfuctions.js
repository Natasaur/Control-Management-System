import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../../utils/Constants';

export function useAsistenciaJFuctions() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteACI = ENV.API_ROUTES.MrCGGgYbz7bGyIIOxC5QxaeomHx2pOADlTWt4WMwQdO1UMd5iHCAI;
    const token = Cookies.get('token');
    const [modalAbrir, setModalAbrir] = useState(false);
    const [alerta, setAlerta] = useState(null);
    const [valorFormulario, setValorFormulario] = useState({
        Matricula: '',
        Ciclo: '',
        Fecha: '',
        Grupo: '',
    });
    const [guardarDato, setGuardarDato] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const abrirModal = () => {
        setModalAbrir(true);
    };

    const cerrarModal = () => {
        setModalAbrir(false);
    };

    const manejarCambioEntrada = (e) => {
        const { name, value } = e.target;
        setValorFormulario((prevFormValues) => ({
            ...prevFormValues,
            [name]: value,
        }));
    };

    // Función auxiliar para formatear la fecha en "dd/mm/yyyy"
    const formatearFechaDDMMYYYY = (fechaISO) => {
        const [year, month, day] = fechaISO.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    const enviarFormulario = async (e) => {
        e.preventDefault();
        const { Matricula, Ciclo, Fecha, Grupo } = valorFormulario;
        if (!Matricula || !Ciclo || !Fecha || !Grupo) {
            mostrarAlerta('Por favor, complete todos los campos antes de guardar.', 'danger');
            return;
        }

        const matriculaString = Matricula.toString();
        const cicloString = Ciclo.toString();

        // Obtener la fecha actual en el mismo formato que la fecha seleccionada (dd/mm/yyyy)
        const fechaActual = new Date().toLocaleDateString('en-GB'); // Formato dd/mm/yyyy

        // Verificar si la fecha seleccionada es válida (no es anterior ni posterior a la fecha actual)
        if (Fecha < fechaActual) {
            console.log('Fecha seleccionada:', Fecha);
            console.log('Fecha actual:', fechaActual);
            console.log('Comparación de fechas:', Fecha < fechaActual);
            mostrarAlerta('Error: No se puede guardar una asistencia en fechas anteriores.', 'danger');
            return;
        }

        try {
            // Formatear la fecha en "dd/mm/yyyy" antes de enviarla al servidor
            const fechaFormateada = formatearFechaDDMMYYYY(Fecha);

            const newData = {
                matricula: matriculaString,
                grupo: Grupo,
                ciclo_escolar: cicloString,
                fecha: fechaFormateada,
                tipo_asistencia: 'justificada',
            };

            const urlACI = `${BASE_PATH}${RouteACI}`;
            await axios.post(urlACI, newData, {
                headers: {
                    Authorization: token,
                },
            });

            setGuardarDato((prevGuardarDato) => [...prevGuardarDato, newData]);
            setValorFormulario({
                Matricula: '',
                Ciclo: '',
                Fecha: '',
                Grupo: '',
            });

            setMensaje('Datos guardados correctamente');
            setMostrarModal(true);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                mostrarAlerta('Error: Ya existe una asistencia registrada para la misma matrícula y fecha.', 'danger');
            }
        }
    };


    const mostrarAlerta = (mensaje, tipo) => {
        setAlerta({ mensaje, tipo });
        setTimeout(() => {
            setAlerta(null);
        }, 3000);
    };

    const alternarModal = () => {
        setMostrarModal(!mostrarModal);
    };

    return {
        modalAbrir,
        valorFormulario,
        guardarDato,
        mensaje,
        mostrarModal,
        alerta,
        setAlerta,
        abrirModal,
        cerrarModal,
        manejarCambioEntrada,
        enviarFormulario,
        alternarModal
    };
}

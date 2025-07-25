import { useState, forwardRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import { ENV } from '../../utils/Constants';

export default function useVisualizarAFunctions() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteAB = ENV.API_ROUTES.PuEkEqdgECgyKaFyquPDFhpuVkDMYFIyx0nHCnpmzCBV9NMeZOA;
    const RouteAE = ENV.API_ROUTES.X68nbSAEMV6KkoeQkkwayOn7aA4OzE2T0hLyCqOxsZHcgxEPwtEA;
    const [seleccionaFecha, setSeleccionarFecha] = useState(null);
    const [asistencias, setAsistencias] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);
    const token = Cookies.get('token');
    const matricula = Cookies.get('matricula');
    const [isLoading, setIsLoading] = useState(false);

    const cambiarFecha = (date) => {
        setSeleccionarFecha(date);
    };
    const seleccionarInput = forwardRef(({ value, onClick }, ref) => (
        <input
            className="date-picker-input"
            value={value}
            onClick={onClick}
            placeholder="Seleccionar fecha"
            readOnly
            ref={ref}
        />
    ));

    const obtenerAsistencias = async () => {
        if (seleccionaFecha) {
            setIsLoading(true);
            const formattedDate = format(seleccionaFecha, 'dd/MM/yyyy');
            const urlAB = `${BASE_PATH}${RouteAB}`;
            const data = {
                matricula: matricula,
                fecha: formattedDate,
            };
            console.log(data);
            try {
                const response = await axios.post(urlAB, data, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setAsistencias(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const numeroPagina = 5; // Número de elementos por página

    // Lógica para calcular los índices de inicio y fin de los elementos a mostrar en la página actual
    const indiceUltimoElemento = paginaActual * numeroPagina;
    const índiceDelPrimerElemento = indiceUltimoElemento - numeroPagina;
    const elementosActuales = asistencias.slice(índiceDelPrimerElemento, indiceUltimoElemento);

    // Función para cambiar a la página anterior
    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    // Función para cambiar a la página siguiente
    const irAPaginaSiguiente = () => {
        const totalPáginas = Math.ceil(asistencias.length / numeroPagina);
        if (paginaActual < totalPáginas) {
            setPaginaActual(paginaActual + 1);
        }
    };

    // Función para eliminar una asistencia
    const eliminarAsistencia = (matricula, fecha) => {
        const urlAE = `${BASE_PATH}${RouteAE}`;
        const data = { matricula, fecha };

        axios
            .delete(urlAE, {
                headers: {
                    Authorization: `${token}`,
                },
                data: data,
            })
            .then(() => {
                const nuevasAsistencias = asistencias.filter((asistencia) => asistencia.matricula !== matricula || asistencia.fecha !== fecha);
                setAsistencias(nuevasAsistencias);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleEliminarAsistencia = () => {
        if (asistenciaSeleccionada) {
            eliminarAsistencia(asistenciaSeleccionada.matricula, asistenciaSeleccionada.fecha);
            setAsistenciaSeleccionada(null);
        }
        setShowConfirmModal(false);
    };

    const handleCerrarModal = () => {
        setAsistenciaSeleccionada(null);
        setShowConfirmModal(false);
    };

    const handleMostrarConfirmModal = (asistencia) => {
        setAsistenciaSeleccionada(asistencia);
        setShowConfirmModal(true);
    };

    return {
        seleccionaFecha,
        asistencias,
        cambiarFecha,
        obtenerAsistencias,
        elementosActuales,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceUltimoElemento,
        showConfirmModal,
        handleEliminarAsistencia,
        handleCerrarModal,
        handleMostrarConfirmModal,
        seleccionarInput,
        isLoading 
    };
}

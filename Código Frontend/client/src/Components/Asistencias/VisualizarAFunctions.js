import { useState, useEffect, forwardRef } from 'react';
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
    //const matricula = Cookies.get('matricula');
    const [isLoading, setIsLoading] = useState(false);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [tipo_asistencia, setTipoAsistencia] = useState('');

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

    useEffect(() => {
        let isMounted = true;
        if (!token) return;

        const fetchAsistencias = async () => {
            setIsLoading(true);
            const urlAB = `${BASE_PATH}${RouteAB}`;

            try {
                const response = await axios.post(urlAB, {}, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (isMounted) {
                    setAsistencias(response.data);
                    setPaginaActual(1);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchAsistencias();

        return () => {
            isMounted = false;
        };
    }, [token]);

    const obtenerAsistencias = async ({ fechaInicio, fechaFin, tipo_asistencia }) => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const urlAB = `${BASE_PATH}${RouteAB}`;
        const data = {};

        if (fechaInicio) data.fechaInicio = format(fechaInicio, 'yyyy-MM-dd');
        if (fechaFin) data.fechaFin = format(fechaFin, 'yyyy-MM-dd');
        if (tipo_asistencia) data.tipo_asistencia = tipo_asistencia;

        try {
            const response = await axios.post(urlAB, data, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setAsistencias(response.data);
            setPaginaActual(1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const numeroPagina = 15; // Número de elementos por página

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
    const eliminarAsistencia = (_id) => {
        const urlAE = `${BASE_PATH}${RouteAE}`;
        const data = { _id };

        axios
            .delete(urlAE, {
                headers: {
                    Authorization: `${token}`,
                },
                data: data,
            })
            .then(() => {
                const nuevasAsistencias = asistencias.filter((asistencia) => asistencia._id !== _id);
                setAsistencias(nuevasAsistencias);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleEliminarAsistencia = () => {
        if (asistenciaSeleccionada) {
            eliminarAsistencia(asistenciaSeleccionada._id);
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
        tipo_asistencia,
        setTipoAsistencia,
        fechaInicio,
        fechaFin,
        setFechaInicio,
        setFechaFin,
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

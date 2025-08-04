import { useState, useEffect, forwardRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { parseISO, isValid } from "date-fns";
import { ENV } from '../../utils/Constants';


export default function useVisualizarAFunctions() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteAB = "/grupo/buscar";
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
    const [grupo, setGrupo] = useState('');
    const [matricula, setMatricula] = useState('');
    const [grupos, setGrupos] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [filtroAplicado, setFiltroAplicado] = useState(false);


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

        const fetchGruposYAlumnos = async () => {
            try {
                const token = localStorage.getItem('token');
                const [gruposRes, alumnosRes] = await Promise.all([
                    axios.get(`${BASE_PATH}/grupo/buscar`, {
                        headers: {
                            Authorization: `${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get(`${BASE_PATH}/alumno/todos`, {
                        headers: {
                            Authorization: `${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                ]);
                setGrupos(gruposRes.data);     // ← Esto llena tu select
                setAlumnos(alumnosRes.data);
            } catch (error) {
                console.error('Error al obtener grupos y alumnos:', error);
            }
        };

        const fetchAsistencias = async () => {
            setIsLoading(true);
            const urlAB = `${BASE_PATH}/grupo/buscar`;

            try {
                const response = await axios.get(urlAB, {}, {
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
        fetchGruposYAlumnos();

        return () => {
            isMounted = false;
        };
    }, [token, BASE_PATH, RouteAB]);

    const obtenerAsistencias = async ({ fechaInicio, fechaFin, grupo }) => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const data = {};

        // Validar y formatear fechaInicio
        if (fechaInicio) {
            const parsedInicio = parseISO(fechaInicio);
            if (isValid(parsedInicio)) {
                data.fechaInicio = parsedInicio.toISOString();
            }
        }

        // Validar y formatear fechaFin
        if (fechaFin) {
            const parsedFin = parseISO(fechaFin);
            if (isValid(parsedFin)) {
                data.fechaFin = parsedFin.toISOString();
            }
        }

        if (grupo) data.grupo = grupo;

        try {
            const response = await axios.post(`${BASE_PATH}/asistencia/filtrarPorGrupo`, data, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setAsistencias(response.data);
            setPaginaActual(1);
            setFiltroAplicado(true); // ✅ Añadir esta línea
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerAlumnosPorGrupo = async (grupoSeleccionado) => {
        try {
            const res = await axios.post(`${BASE_PATH}/alumno/porGrupo`, { grupo: grupoSeleccionado });
            setAlumnos(res.data);  // Esto actualizará automáticamente el useMemo de TablaAsistencias.jsx
        } catch (error) {
            console.error("Error al obtener alumnos por grupo:", error);
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
        if (!asistencia.justificada) {
            alert("Solo puedes eliminar asistencias justificadas.");
            return;
        }

        setAsistenciaSeleccionada(asistencia);
        setShowConfirmModal(true);
    };

    return {
        filtroAplicado,
        grupos,
        alumnos,
        matricula,
        setMatricula,
        grupo,
        setGrupo,
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
        isLoading,
        obtenerAlumnosPorGrupo,
    };
}

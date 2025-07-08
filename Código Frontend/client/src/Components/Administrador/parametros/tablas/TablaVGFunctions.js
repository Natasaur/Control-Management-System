import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../../../utils/Constants';

export function useTablaVG() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteGB = ENV.API_ROUTES.gl5C3lRNO66rhil5MeCnDFD8WLMIOG;
    const RouteGE = ENV.API_ROUTES.x4A4MEAoshYSoAmMja4Sseaj6lqrJMYEG;
    const RouteGRD = ENV.API_ROUTES.OoPr5tGbQ4UbxfsgpzYtWLX0FTHImUEG;
    const RouteGCI = ENV.API_ROUTES.R0WYKoBdXJ0gzqFI3Gtrr8R82NDNluRqBg62NzSqJvTrTyqjbe22UOGI;
    const [grupos, setGrupos] = useState([]);
    const [gruposSeleccionado, setGruposSeleccionado] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [valorFromulario, setValorFormulario] = useState({ Grupo: '' });
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [valoresEditados, setValoresEditados] = useState(null);
    const [dialogoConfirmacionAbierto, setDialogoConfirmacionAbierto] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState('');
    const token = Cookies.get('token');

    const obtenerGrupos = async () => {
        try {
            const urlGB = `${BASE_PATH}${RouteGB}`;
            const respuesta = await axios.get(urlGB, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setGrupos(respuesta.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        obtenerGrupos();
    }, []);

    const manejarSeleccionGrupo = (grupo) => {
        setGruposSeleccionado(grupo);
    };
    

    const eliminarGrupo = async () => {
        if (gruposSeleccionado) {
            const { grupo } = gruposSeleccionado;
            try {
                const urlGE = `${BASE_PATH}${RouteGE}`;
                await axios.delete(urlGE, {
                    data: { grupo },
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                obtenerGrupos();
                console.log("Grupo eliminado");
            } catch (error) {
                console.error("Error al eliminar el grupo:", error);
            }
        }
    };

    const manejarCambiosGrupo = (nuevoGrupo) => {
        console.log(nuevoGrupo);
        setValoresEditados((prevState) => ({
            ...prevState,
            grupo: nuevoGrupo,
        }));
    };

    const editarGrupo = async (grupo, nuevoGrupo) => {
        try {
            if (nuevoGrupo !== null) {
                const datosGrupo = {
                    grupo: grupo,
                    nuevoGrupo: nuevoGrupo,
                };
                const urlGED = `${BASE_PATH}${RouteGRD}`;
                await axios.patch(urlGED,
                    datosGrupo,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                obtenerGrupos();
            }
        } catch (error) {
            console.error('Error al enviar la solicitud PATCH:', error);
        }
    };


    const abrirModal = () => {
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    const manejarCambioEntrada = (e) => {
        const { name, value } = e.target;
        setValorFormulario((prevFormValues) => ({
            ...prevFormValues,
            [name]: value,
        }));
    };

    const enviarFormulario = async (e) => {
        e.preventDefault();
        const { Grupo } = valorFromulario;
        if (!Grupo) {
            setMensajeAlerta('Por favor, complete todos los campos antes de guardar.');
            setMostrarAlerta(true);
            return;
        }

        const grupoString = Grupo.toString();
        try {
            const newData = {
                grupo: grupoString,
            };
            const urlGCI = `${BASE_PATH}${RouteGCI}`;
            await axios.post(urlGCI, newData, {
                headers: {
                    Authorization: token,
                },
            });
            await obtenerGrupos();
            setValorFormulario({
                Grupo: '',
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const abrirModalEditar = () => {
        manejarSeleccionGrupo(gruposSeleccionado);
        setModalAbierto(true);
    };

    const cerrarModalEditar = () => {
        setValoresEditados(null);
        setModalAbierto(false);
    };

    const mostrarConfirmacionEliminar = () => {
        setDialogoConfirmacionAbierto(true);
    };

    const confirmarEliminarGrupo = () => {
        eliminarGrupo();
        setDialogoConfirmacionAbierto(false);
    };

    const guardarCambios = () => {
        editarGrupo(gruposSeleccionado?.grupo, valoresEditados?.grupo);
        setModalAbierto(false);
        setValoresEditados(null);
    };

    const PAGE_SIZE = 5; // Tamaño de página
    // Lógica para calcular los usuarios a mostrar en la página actual
    const indiceInicio = (paginaActual - 1) * PAGE_SIZE;
    const indiceFin = indiceInicio + PAGE_SIZE;
    const gruposPaginados = grupos
        .filter(grupo =>
            grupo.grupo.toLowerCase().includes(busqueda.toLowerCase())
        )
        .slice(indiceInicio, indiceFin);

    // Función para cambiar a la página anterior
    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    // Función para cambiar a la página siguiente
    const irAPaginaSiguiente = () => {
        if (indiceFin < grupos.length) {
            setPaginaActual(paginaActual + 1);
        }
    };

    return {
        grupos,
        gruposSeleccionado,
        manejarSeleccionGrupo,
        eliminarGrupo,
        manejarCambiosGrupo,
        editarGrupo,
        modalAbierto,
        valorFromulario,
        abrirModal,
        cerrarModal,
        manejarCambioEntrada,
        enviarFormulario,
        mostrarAlerta,
        mensajeAlerta,
        valoresEditados,
        setValoresEditados,
        setModalAbierto,
        dialogoConfirmacionAbierto,
        setDialogoConfirmacionAbierto,
        abrirModalEditar,
        cerrarModalEditar,
        mostrarConfirmacionEliminar,
        confirmarEliminarGrupo,
        guardarCambios,
        gruposPaginados,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceFin,
        setBusqueda,
        busqueda
    };
}
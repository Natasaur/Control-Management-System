import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ENV } from "../../../../utils/Constants";

export function useUFuctions() {
    const BASE_PATH = ENV.BASE_PATH;
    const buscarURoute = ENV.API_ROUTES.aQB4BaS1i3puGyzLQdK79kupg3aShSpIOU;
    const usuarioActualizarRoute = ENV.API_ROUTES.G22HHEoHdp2J1jF4JShU8w8ixWpbs6g7Ft1ViZbuvPoNNl23dAU;
    const eliminarRoute = ENV.API_ROUTES.YVCzWobTmjwdBLxpnvZDCN50xuLa5EU;
    const buscarMRoute = ENV.API_ROUTES.kPBnDqc5yVlf0Hs7cjzhJ8vA9OZwjjxnZydqwJQceEGuvp59ONOUU;
    const [usuario, setUsuarios] = useState([]);
    const [abrir, setAbrir] = useState(false);
    const [confirmarAbrir, setConfirmarAbrir] = useState(false);
    const [seleccionarUsuario, setSeleccionarUsuario] = useState(null);
    const [seleccionarUsuarioId, setSeleccionarUsuarioId] = useState(null);
    const [exitoDialogoAbierto, setExitoDialogoAbierto] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [matriculaBusqueda, setMatriculaBusqueda] = useState('');
    const [alerta, setAlerta] = useState(null);
    const token = Cookies.get('token');

    useEffect(() => {
        if (token) {
            fetchUsuarios();
        }
    }, []);

    const fetchUsuarios = async () => {
        try {
            const urlBuscarUsuario = `${BASE_PATH}${buscarURoute}`;
            const response = await axios.get(urlBuscarUsuario, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    const actualizarUsuario = async (usuarioActualizado) => {
        try {
            const urlActualizarUsuario = `${BASE_PATH}${usuarioActualizarRoute}`;
            const response = await axios.patch(urlActualizarUsuario,
                usuarioActualizado,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            console.log("Usuario actualizado:", response.data);
            fetchUsuarios();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    const eliminarUsuario = async (matricula) => {
        try {
            const urlEliminar = `${BASE_PATH}${eliminarRoute}`;
            await axios.delete(urlEliminar, {
                data: { matricula },
                headers: {
                    Authorization: `${token}`,
                },
            });
            fetchUsuarios(); // Actualizar la lista de usuarios después de la eliminación
            console.log("Usuario eliminado");
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const buscarUsuarioPorMatricula = async () => {
        try {
            const urlBuscarM = `${BASE_PATH}${buscarMRoute}`;
            const response = await axios.post(urlBuscarM,
                { matricula: matriculaBusqueda },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            const usuarioEncontrado = response.data;
            setSeleccionarUsuario(usuarioEncontrado);
            setSeleccionarUsuarioId(usuarioEncontrado.matricula);

        } catch (error) {
            console.error(`Error al buscar el usuario con matrícula ${matriculaBusqueda}:`, error);
            mostrarAlerta("Usuario no encontrado", "danger");
        }
    };

    const ActualizarUsuario = (usuario) => {
        setSeleccionarUsuario(usuario);
        setSeleccionarUsuarioId(usuario.matricula);
        setAbrir(true);
    };

    const handleCerrar = () => {
        setAbrir(false);
    };

    const GuardarCambios = async () => {
        try {
            seleccionarUsuario.matriculaOriginal = seleccionarUsuario.matricula
            await actualizarUsuario(seleccionarUsuario);
            setAbrir(false);
            setExitoDialogoAbierto(true);
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    const EliminarUsuario = () => {
        setConfirmarAbrir(true);
    };

    const confirmarEliminarUsuario = async () => {
        try {
            await eliminarUsuario(seleccionarUsuario.matricula);
            setSeleccionarUsuario(null);
            setSeleccionarUsuarioId(null);
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        } finally {
            setConfirmarAbrir(false);
        }
    };

    const handleClickFila = (usuario) => {
        if (seleccionarUsuarioId === usuario.matricula) {
            setSeleccionarUsuario(null);
            setSeleccionarUsuarioId(null);
        } else {
            setSeleccionarUsuario(usuario);
            setSeleccionarUsuarioId(usuario.matricula);
        }
    };

    const handleCambio = (e) => {
        setSeleccionarUsuario((prevUsuario) => ({
            ...prevUsuario,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCambioSelect = (e, campo) => {
        const { value } = e.target;
        setSeleccionarUsuario((prevUsuario) => ({
            ...prevUsuario,
            [campo]: value
        }));
    };

    const PAGE_SIZE = 20; // Tamaño de página
    // Lógica para calcular los usuarios a mostrar en la página actual
    const indiceInicio = (paginaActual - 1) * PAGE_SIZE;
    const indiceFin = indiceInicio + PAGE_SIZE;
    const usuariosPaginados = usuario && usuario.slice(indiceInicio, indiceFin);

    // Función para cambiar a la página anterior
    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    // Función para cambiar a la página siguiente
    const irAPaginaSiguiente = () => {
        if (indiceFin < usuario.length) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const mostrarAlerta = (mensaje, tipo) => {
        setAlerta({ mensaje, tipo });
        setTimeout(() => {
            setAlerta
                (null);
        }, 3000);
    };

    const plantelNombres = {
        A: 'Atizapán',
        E: 'Ecatepec',
        V: 'HAVRE',
        X: 'Ixtapaluca',
        I: 'Iztapalapa',
        R: 'Los Reyes',
        N: 'NEZA',
        T: 'Toluca',
        S: 'Toreo',
        Z: 'Zona Rosa',
        C: 'COACALCO',
        U: 'CUAUTITLAN',
        H: 'CHALCO',
    };

    return {
        usuario,
        abrir,
        alerta,
        confirmarAbrir,
        setConfirmarAbrir,
        seleccionarUsuarioId,
        exitoDialogoAbierto,
        setExitoDialogoAbierto,
        ActualizarUsuario,
        handleCerrar,
        GuardarCambios,
        EliminarUsuario,
        confirmarEliminarUsuario,
        handleClickFila,
        handleCambio,
        seleccionarUsuario,
        usuariosPaginados,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceFin,
        buscarUsuarioPorMatricula,
        setMatriculaBusqueda,
        matriculaBusqueda,
        plantelNombres,
        handleCambioSelect
    };
}

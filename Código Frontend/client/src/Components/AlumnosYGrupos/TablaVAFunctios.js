import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../utils/Constants';

export function useTablaVA() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteAT = ENV.API_ROUTES.rP2cqUJM5x56b5bbkrOiyxbN6woiXAOAS;
    const RouteAE = ENV.API_ROUTES.S75wCLxy6ZkpSHYjJRgN8qdnBrQkH2EBA;
    const RouteAA = ENV.API_ROUTES.XOoFVA5ed0IKBo5xxRubQl9zzU0MNjm7kgXGek1Do8ZtDYoS3kAA;
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [dialogoConfirmacionAbierto, setDialogoConfirmacionAbierto] = useState(false);
    const [dialogoEdicionAbierto, setDialogoEdicionAbierto] = useState(false);
    const [usuarioEditado, setUsuarioEditado] = useState({});
    const [usuarioActualizado, setUsuarioActualizado] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState('');

    const token = Cookies.get('token');

    useEffect(() => {
        const obtenerUsuarios = async () => {
        try {
            const urlAT = `${BASE_PATH}${RouteAT}`;
            const respuesta = await axios.get(urlAT, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setUsuarios(respuesta.data);
        } catch (error) {
            console.error(error);
        }
    };
        if (token) {
            obtenerUsuarios();
        }
    }, [token, BASE_PATH, RouteAT]);

    const obtenerUsuarios = async () => {
        try {
            const urlAT = `${BASE_PATH}${RouteAT}`;
            const respuesta = await axios.get(urlAT, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setUsuarios(respuesta.data);
        } catch (error) {
            console.error(error);
        }
    };

    const manejarSeleccionUsuario = (usuario) => {
        if (usuario === usuarioSeleccionado) {
            setUsuarioSeleccionado(null);
        } else {
            setUsuarioSeleccionado(usuario);
        }
    };


    const mostrarConfirmacionEliminar = () => {
        setDialogoConfirmacionAbierto(true);
    };

    const eliminarAlumno = async (manejarCancelarEliminarUsuario) => {
        if (usuarioSeleccionado) {
            const { matricula } = usuarioSeleccionado;
            try {
                const urlAE = `${BASE_PATH}${RouteAE}`;
                await axios.delete(urlAE, {
                    data: { matricula },
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                obtenerUsuarios();
                console.log('Alumno eliminado');
                manejarCancelarEliminarUsuario();
            } catch (error) {
                console.error('Error al eliminar el alumno:', error);
            }
        }
    };


    const manejarEliminarUsuario = () => {
        eliminarAlumno(manejarCancelarEliminarUsuario);
        mostrarConfirmacionEliminar();
    };


    const manejarCancelarEliminarUsuario = () => {
        setUsuarioSeleccionado(null);
        setDialogoConfirmacionAbierto(false);
    };

    const manejarEditarUsuario = () => {
        setUsuarioEditado(usuarioSeleccionado);
        setDialogoEdicionAbierto(true);
    };

    const manejarCancelarActualizarUsuario = () => {
        setUsuarioEditado({});
        setDialogoEdicionAbierto(false);
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setUsuarioEditado((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const manejarActualizarUsuario = async () => {
        if (usuarioEditado) {
            try {
                const urlAA = `${BASE_PATH}${RouteAA}`;
                await axios.patch(urlAA, usuarioEditado, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                obtenerUsuarios();
                console.log('Alumno actualizado');
                manejarCancelarActualizarUsuario();
                setUsuarioActualizado(true);
            } catch (error) {
                console.error('Error al actualizar el alumno:', error);
            }
        }
    };

    const cerrarAlertaUsuarioActualizado = () => {
        setUsuarioActualizado(false);
    };

    const PAGE_SIZE = 10;

    const indiceInicio = (paginaActual - 1) * PAGE_SIZE;
    const indiceFin = indiceInicio + PAGE_SIZE;

    const usuariosPaginados = usuarios
        .filter(usuario => {
            if (usuario && usuario.nombre) {
                return usuario.matricula.toLowerCase().includes(busqueda.toLowerCase());
            }
            return false;
        })
        .slice(indiceInicio, indiceFin);


    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    const irAPaginaSiguiente = () => {
        if (indiceFin < usuarios.length) {
            setPaginaActual(paginaActual + 1);
        }
    };

    return {
        usuarios,
        usuarioSeleccionado,
        dialogoConfirmacionAbierto,
        dialogoEdicionAbierto,
        usuarioEditado,
        usuarioActualizado,
        obtenerUsuarios,
        manejarSeleccionUsuario,
        manejarCancelarEliminarUsuario,
        manejarEditarUsuario,
        manejarCancelarActualizarUsuario,
        manejarCambio,
        manejarActualizarUsuario,
        cerrarAlertaUsuarioActualizado,
        manejarEliminarUsuario,
        mostrarConfirmacionEliminar,
        usuariosPaginados,
        irAPaginaAnterior,
        irAPaginaSiguiente,
        paginaActual,
        indiceFin,
        setBusqueda,
        busqueda
    };
}

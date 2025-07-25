import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {ENV} from '../../utils/Constants';

export default function useCrearUSFuctions() {
    const BASE_PATH = ENV.BASE_PATH;
    const buscarAPRoute = ENV.API_ROUTES.L4bGEcZxAnjetUarpJVSCVOexDA4I8MYQwlLiL6CXUZzzh3zsIMaOAA;
    const crearUIRoute = ENV.API_ROUTES.XlZaTHhsYYDR7eUpe6Ock0YR3NApcri6EOjxDhJbtWVIC6nG4eCU1;
    const [modalEstaAbierto, setModalEstaAbierto] = useState(false);
    const [valoresFormulario, setValoresFormulario] = useState({
        Matricula: '',
        Nombre: '',
        Apellido_paterno: '',
        Apellido_materno: '',
        Plantel: '',
        Correo: '',
        Rol: '',
    });
    const [datosGuardados, setDatosGuardados] = useState([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');

    const abrirModal = () => {
        setModalEstaAbierto(true);
    };

    const cerrarModal = () => {
        setModalEstaAbierto(false);
    };

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setValoresFormulario((valoresAnteriores) => ({
            ...valoresAnteriores,
            [name]: value,
        }));
    };

    const enviarFormulario = async (e) => {
        e.preventDefault();
        const { Matricula, Nombre, Apellido_paterno, Apellido_materno, Plantel, Correo, Rol } = valoresFormulario;
        if (!Matricula || !Nombre || !Apellido_paterno || !Apellido_materno || !Plantel || !Correo || !Rol) {
            setMensajeAlerta('Por favor, complete todos los campos antes de guardar.');
            setMostrarAlerta(true);
            return;
        }
        const matriculaString = Matricula.toString();

        try {
            const token = Cookies.get('token');

            const nuevosDatos = {
                matricula: matriculaString,
                nombre: Nombre,
                apellido_paterno: Apellido_paterno,
                apellido_materno: Apellido_materno,
                plantel: Plantel,
                correo: Correo,
                rol: Rol,
            };
            const url = `${BASE_PATH}${buscarAPRoute}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            const cantidadUsuariosAP = response.data.filter((usuario) => usuario.rol === 'AP').length;

            if (cantidadUsuariosAP >= 3 && Rol === 'AP') {
                setMensajeAlerta('No se puede registrar más usuarios con el rol "AP".');
                setMostrarAlerta(true);
                return;
            }
            const urlCrear = `${BASE_PATH}${crearUIRoute}`;
            await axios.post(urlCrear, nuevosDatos, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setDatosGuardados((datosGuardadosAnteriores) => [...datosGuardadosAnteriores, nuevosDatos]);
            setValoresFormulario({
                Matricula: '',
                Nombre: '',
                Apellido_paterno: '',
                Apellido_materno: '',
                Plantel: '',
                Correo: '',
                Rol: '',
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const guardar = () => {
        enviarFormulario();
    };

    return {
        modalEstaAbierto,
        valoresFormulario,
        datosGuardados,
        abrirModal,
        cerrarModal,
        manejarCambioInput,
        enviarFormulario,
        guardar,
        mostrarAlerta,
        mensajeAlerta,
    };
}

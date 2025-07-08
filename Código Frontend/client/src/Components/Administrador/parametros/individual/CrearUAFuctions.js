import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../../../utils/Constants';

export default function useCrearUAFuctions() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteACI = ENV.API_ROUTES.cnlQltoV3Un6QqfHutnWJoVUYyHe4OBXLBahwbBdbsiTookIPUCAI;
    const [modalAbrir, setModalAbrir] = useState(false);
    const [valorFormulario, setValorFormulario] = useState({
        Matricula: '',
        Nombre: '',
        Apellido_paterno: '',
        Apellido_materno: '',
        Grupo: '',
        Ciclo_escolar: '',
        Contacto: '',
    });
    const [datosGuardar, setDatosGuardar] = useState([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
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
    const enviarFormulario = async (e) => {
        e.preventDefault();
        const { Matricula, Nombre, Apellido_paterno, Apellido_materno, Grupo, Ciclo_escolar, Contacto } = valorFormulario;
        if (!Matricula || !Nombre || !Apellido_paterno || !Apellido_materno || !Grupo || !Ciclo_escolar || !Contacto) {
            setMensajeAlerta('Por favor, complete todos los campos antes de guardar.');
            setMostrarAlerta(true);
            return;
        }
        const matriculaString = Matricula.toString();
        try {
            const token = Cookies.get('token');
            const newData = {
                matricula: matriculaString,
                nombre: Nombre,
                apellido_paterno: Apellido_paterno,
                apellido_materno: Apellido_materno,
                grupo: Grupo,
                ciclo_escolar: Ciclo_escolar,
                contacto: Contacto,
                
            };
            const urlACI = `${BASE_PATH}${RouteACI}`;
            await axios.post(urlACI, newData, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setDatosGuardar((prevSavedData) => [...prevSavedData, newData]);
            setValorFormulario({
                Matricula: '',
                Nombre: '',
                Apellido_paterno: '',
                Apellido_materno: '',
                Grupo: '',
                Ciclo_escolar: '',
                Contacto: '',
            });
            console.log(newData);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleGuardar = async () => {
        try {
            await enviarFormulario();
            setMensajeAlerta('Alumno creado correctamente.');
            setMostrarAlerta(true);
        } catch (error) {
            console.error(error);
        }
    };
    return {
        modalAbrir,
        valorFormulario,
        datosGuardar,
        abrirModal,
        cerrarModal,
        manejarCambioEntrada,
        enviarFormulario,
        handleGuardar,
        mostrarAlerta,
        mensajeAlerta,
    };
}

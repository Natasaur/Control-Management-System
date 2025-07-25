import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../utils/Constants';

export default function useCrearUAFuctions() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteACI = ENV.API_ROUTES.cnlQltoV3Un6QqfHutnWJoVUYyHe4OBXLBahwbBdbsiTookIPUCAI;

   // const [modalAbrir, setModalAbrir] = useState(false);
    const [valorFormulario, setValorFormulario] = useState({
        matricula: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        grupo: '',
        ciclo_escolar: '',
        contacto: '',
        imagen: null,
    });

    const [datosGuardar, setDatosGuardar] = useState([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');

    //const abrirModal = () => setModalAbrir(true);
    //const cerrarModal = () => setModalAbrir(false);

    const manejarCambioEntrada = (e) => {
        const { name, value, files } = e.target;
        setValorFormulario((prev) => ({
            ...prev,
            [name.toLowerCase()]: files ? files[0] : value,
        }));
    };

    const enviarFormulario = async (e) => {
        e.preventDefault();

        if (!valorFormulario.imagen || !(valorFormulario.imagen instanceof File)) {
            setMensajeAlerta("Debes seleccionar una imagen válida.");
            setMostrarAlerta(true);
            return;
        }

        const formData = new FormData();

        // Agregar todos los campos
        Object.entries(valorFormulario).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key.toLowerCase(), value);
            }
        });

        try {
            const token = Cookies.get('token');
            const urlACI = `${BASE_PATH}${RouteACI}`;

            const res = await axios.post(urlACI, formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'multipart/form-data',
                },
            });

            setDatosGuardar((prev) => [...prev, res.data]);
            setValorFormulario({
                matricula: '',
                nombre: '',
                apellido_paterno: '',
                apellido_materno: '',
                grupo: '',
                ciclo_escolar: '',
                contacto: '',
                imagen: null,
            });

            setMensajeAlerta('Alumno creado correctamente.');
            setMostrarAlerta(true);
            //cerrarModal();
        } catch (error) {
            console.error(error);
            setMensajeAlerta('Error al crear Alumno.');
            setMostrarAlerta(true);
        }
    };

    return {
        //modalAbrir,
        valorFormulario,
        datosGuardar,
        //abrirModal,
        //cerrarModal,
        manejarCambioEntrada,
        enviarFormulario,
        mostrarAlerta,
        mensajeAlerta,
    };
}
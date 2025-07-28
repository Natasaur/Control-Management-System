import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../utils/Constants';

export function useAsistenciaMFuctions() {
  const BASE_PATH = ENV.BASE_PATH;
  const RouteACI = ENV.API_ROUTES.MrCGGgYbz7bGyIIOxC5QxaeomHx2pOADlTWt4WMwQdO1UMd5iHCAI;
  const token = Cookies.get('token');
  //const [modalAbrir, setModalAbrir] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [valorFormulario, setValorFormulario] = useState({
    Matricula: '',
    Ciclo: '',
    Fecha: '',
    Grupo: '',
  });
  const [guardarDato, setGuardarDato] = useState([]);
  //const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState('');

  /*
  const abrirModal = () => {
    setModalAbrir(true);
  };

  const cerrarModal = () => {
    setModalAbrir(false);
  };
  */

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

  // Validar si la fecha seleccionada es anterior a hoy
  const fechaSeleccionada = new Date(Fecha);
  const fechaHoy = new Date();

  fechaSeleccionada.setHours(0, 0, 0, 0);
  fechaHoy.setHours(0, 0, 0, 0);

  /*
  if (fechaSeleccionada < fechaHoy) {
    mostrarAlerta('Error: No se puede guardar una asistencia en fechas anteriores.', 'danger');
    return;
  }
    */

  try {
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

    setGuardarDato((prev) => [...prev, newData]);
    setValorFormulario({
      Matricula: '',
      Ciclo: '',
      Fecha: '',
      Grupo: '',
    });

    setMensaje('Datos guardados correctamente');
  } catch (error) {
    console.error(error);
    if (error.response?.status === 400) {
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

  /*
  const alternarModal = () => {
    setMostrarModal(!mostrarModal);
  };
  */

  return {
    //modalAbrir,
    valorFormulario,
    guardarDato,
    mensaje,
    //mostrarModal,
    alerta,
    setAlerta,
    //abrirModal,
    //cerrarModal,
    manejarCambioEntrada,
    enviarFormulario,
    //alternarModal
  };
}

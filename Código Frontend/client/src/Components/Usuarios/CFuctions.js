import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ENV } from '../../utils/Constants';

export function useCFuctions() {
  const BASE_PATH = ENV.BASE_PATH;
  const buscarCRoute = ENV.API_ROUTES.xtbiFDl0Crb6x42BFu3xEKBfLNuQKhNByemD1bc7g4njmMbshQOC;
  const buscarUMRoute = ENV.API_ROUTES.kPBnDqc5yVlf0Hs7cjzhJ8vA9OZwjjxnZydqwJQceEGuvp59ONOUU;
  const quitarGRoute = ENV.API_ROUTES.v3ejHiMk2lSFjdorSLLe0Db7X9iiyB4QG;
  const actualizarURoute = ENV.API_ROUTES.G22HHEoHdp2J1jF4JShU8w8ixWpbs6g7Ft1ViZbuvPoNNl23dAU;
  const eliminarURoute = ENV.API_ROUTES.YVCzWobTmjwdBLxpnvZDCN50xuLa5EU;
  const [usuario, setUsuario] = useState([]);
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [gruposSeleccionados, setGruposSeleccionados] = useState({});
  const [abierto, setAbierto] = useState(false);
  const [abiertoConfirmar, setAbiertoConfirmar] = useState(false);
  const [seleccionarUsuario, setSeleccionarUsuario] = useState(null);
  const [seleccionarUsuarioId, setSeleccionarUsuarioId] = useState(null);
  const [exitoDialogoAbierto, setExitoDialogoAbierto] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [matriculaBusqueda, setMatriculaBusqueda] = useState('');
  const urlBuscarCon = `${BASE_PATH}${buscarCRoute}`;

  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      fetchUsuarios();
    }
  }, [token]);

  const fetchUsuarios = async () => {
    try {
      
      const response = await axios.get(urlBuscarCon, {
        headers: {
          Authorization: token,
        },
      });
      const usuarios = response.data;
      setUsuario(usuarios);

      const grupos = usuarios.flatMap((usuario) => usuario.grupos);
      const gruposDisponibles = [...new Set(grupos)];
      setGruposDisponibles(gruposDisponibles);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const buscarUsuarioPorMatricula = async () => {
    try {
      const urlBuscarUM = `${BASE_PATH}${buscarUMRoute}`;
      const response = await axios.post(urlBuscarUM,
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

  const quitarGrupo = async (matricula, grupo) => {
    try {
      const urlQuitarG = `${BASE_PATH}${quitarGRoute}`;
      await axios.patch(urlQuitarG ,
        { matricula, grupo },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error(`Error al quitar el grupo ${grupo} para el usuario ${matricula}:`, error);
    }
  };

  const actualizarUsuario = async (usuarioActualizado) => {
    try {
      const { matricula, gruposSeleccionados, grupo } = usuarioActualizado;

      if (!gruposSeleccionados) {
        quitarGrupo(matricula, grupo);
      }
      const urlActualizarU = `${BASE_PATH}${actualizarURoute}`;
      await axios.patch( urlActualizarU,
        usuarioActualizado,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const eliminarUsuario = async (matricula) => {
    try {
      const response = await axios.get(urlBuscarCon, {
        headers: {
          Authorization: token,
        },
      });
      const usuarioEliminar = response.data;

      if (usuarioEliminar.rol === "C" && usuarioEliminar.grupos.length > 0) {
        mostrarAlerta('Error al eliminar usuario. Aún tiene grupos asignados', 'danger');
        return;
      }
      const urlEliminarU = `${BASE_PATH}${eliminarURoute}`
      await axios.delete(urlEliminarU, {
        data: { matricula },
        headers: {
          Authorization: token,
        },
      });
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const ActualizarUsuario = (usuario) => {
    setSeleccionarUsuario(usuario);
    setSeleccionarUsuarioId(usuario.matricula);
    setAbierto(true);
  };

  const cerrarModal = () => {
    setAbierto(false);
  };

  const GuardarCambios = async () => {
    try {
      seleccionarUsuario.matriculaOriginal = seleccionarUsuario.matricula
      await actualizarUsuario(seleccionarUsuario);
      setAbierto(false);
      setExitoDialogoAbierto(true);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const confirmarEliminarModal = () => {
    setAbiertoConfirmar(true);
  };

  const ConfirmarEliminarUsuario = async () => {
    try {
      await eliminarUsuario(seleccionarUsuario.matricula);
      setSeleccionarUsuario(null);
      setSeleccionarUsuarioId(null);
      setConfirmarEliminar(true);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    } finally {
      setAbiertoConfirmar(false);
    }
  };

  const handleClickFila = (usuario) => {
    if (seleccionarUsuarioId === usuario.matricula) {
      setSeleccionarUsuario(null);
      setSeleccionarUsuarioId(null);
    } else {
      setSeleccionarUsuario(usuario);
      setSeleccionarUsuarioId(usuario.matricula);

      setGruposSeleccionados(usuario.grupos.reduce((acc, grupo) => {
        acc[grupo] = true;
        return acc;
      }, {}));
    }
  };

  const handleCambioTexto = (e) => {
    const { name, value } = e.target;
    setSeleccionarUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value
    }));
  };

  const handleCambioSelect = (e, campo) => {
    const { value } = e.target;
    setSeleccionarUsuario((prevUsuario) => ({
      ...prevUsuario,
      [campo]: value
    }));
  };

  const handleCambio = (e) => {
    const { name, checked } = e.target;
    setSeleccionarUsuario((prevUsuario) => {
      const grupos = [...prevUsuario.grupos];
      if (checked) {
        if (!grupos.includes(name)) {
          grupos.push(name);
        }
      } else {
        const index = grupos.indexOf(name);
        if (index !== -1) {
          grupos.splice(index, 1);
          quitarGrupo(prevUsuario.matricula, name);
        }
      }
      return {
        ...prevUsuario,
        grupos,
      };
    });
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => {
      setAlerta
      (null);
    }, 3000);
  };

  const PAGE_SIZE = 20;
  const indiceInicio = (paginaActual - 1) * PAGE_SIZE;
  const indiceFin = indiceInicio + PAGE_SIZE;
  const usuariosPaginados = usuario && usuario.slice(indiceInicio, indiceFin);

  const irAPaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const irAPaginaSiguiente = () => {
    if (indiceFin < usuario.length) {
      setPaginaActual(paginaActual + 1);
    }
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
    gruposDisponibles,
    seleccionarUsuarioId,
    seleccionarUsuario,
    abierto,
    ActualizarUsuario,
    cerrarModal,
    GuardarCambios,
    ConfirmarEliminarUsuario,
    handleClickFila,
    handleCambioTexto,
    handleCambio,
    exitoDialogoAbierto,
    setExitoDialogoAbierto,
    setAbiertoConfirmar,
    abiertoConfirmar,
    confirmarEliminarModal,
    alerta,
    confirmarEliminar,
    gruposSeleccionados,
    usuariosPaginados,
    irAPaginaAnterior,
    irAPaginaSiguiente,
    paginaActual,
    indiceFin,
    handleCambioSelect,
    plantelNombres,
    buscarUsuarioPorMatricula,
    setMatriculaBusqueda,
    matriculaBusqueda
  };
}
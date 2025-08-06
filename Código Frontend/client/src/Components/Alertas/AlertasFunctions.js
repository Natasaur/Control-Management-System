import { useState } from "react";
import axios from "axios";
import { ENV } from "../../utils/Constants";

export function AlertasFunctions() {
  const BASE_PATH = ENV.BASE_PATH;
  const [alertas, setAlertas] = useState([]);
  const [mostrarBotonDescarga, setMostrarBotonDescarga] = useState(false);

  const obtenerAlertas = async (fechaInicio, fechaFin, plantel) => {
    try {
      const response = await axios.post(`${BASE_PATH}/alertas/plantel`, {
        fechaInicio,
        fechaFin,
        plantel,
      });
      setAlertas(response.data);
      setMostrarBotonDescarga(true);
    } catch (error) {
      console.error("Error al obtener alertas:", error);
      setAlertas([]);
      setMostrarBotonDescarga(false);
    }
  };

  return {
    alertas,
    mostrarBotonDescarga,
    obtenerAlertas,
  };
}

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../utils/Constants';

export function useCsvTablaFunctionsG() {
  const BASE_PATH = ENV.BASE_PATH;
  const RouteGB = ENV.API_ROUTES.gl5C3lRNO66rhil5MeCnDFD8WLMIOG;
  const RouteGCL = ENV.API_ROUTES.EOPBPoSLej9LC1xm6H6sW82FnISfU6FPVe5bAjIgFJYSRwXMDDuCLG;
  const [seleccionadoArchivo, setSeleccionadoArchivo] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [seleccionarFila, setSeleccionarFila] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [existeDato, setExisteDato] = useState([]);
  const [alerta, setAlerta] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const token = Cookies.get('token');
  const requiredColumns = ["Grupo"];

  useEffect(() => {
    const fetchExisteData = async () => {
      try {
        const urlGB = `${BASE_PATH}${RouteGB}`;
        const response = await axios.get(urlGB, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setExisteDato(response.data);
      } catch (error) {
        console.error('Error al obtener los datos existentes:', error);
      }
    };
    fetchExisteData();
  }, [token]);

  const manejarCarga = (evento) => {
    const file = evento.target.files[0];

    if (!file) {
        alert("Por favor, seleccione un archivo CSV.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const texto = e.target.result;
        const { data } = Papa.parse(texto, { header: true });

        // Verificar si todas las columnas requeridas están presentes y en el orden correcto
        const hasAllColumns = requiredColumns.every((col, index) => {
            const actualColumn = Object.keys(data[0])[index];
            return actualColumn === col;
        });

        if (!hasAllColumns) {
            mostrarAlerta("El archivo CSV debe contener las siguientes columnas en el siguiente orden: Grupo", "danger");
            return;
        }

        // Filtrar filas con todos los campos completos
        const filteredData = data.filter((item) => requiredColumns.every((col) => col in item && item[col].trim() !== ""));
        setCsvData(filteredData);

        setSeleccionadoArchivo(true);
        const convertedData = filteredData.map((item) => {
            const convertedItem = {};
            Object.entries(item).forEach(([key, value]) => {
                convertedItem[key] = value !== undefined ? value.toString() : "";
            });
            return convertedItem;
        });
        setJsonData(convertedData);
    };

    reader.readAsText(file);
};

  const manejarClickFila = (indiceFila) => {
    setSeleccionarFila(indiceFila);
  };

  const agregarFila = () => {
    if (csvData.length === 0) {
      mostrarAlerta('Por favor, cargue un archivo CSV primero.', 'danger');
      return;
    }
    const nuevaFila = {
      'Grupo': 'valor',
    };
    const nuevoCsvData = [...csvData, nuevaFila];
    setCsvData(nuevoCsvData);
    enviarDatos(nuevoCsvData);
  };

  const eliminarFila = () => {
    setCsvData((estadoPrevio) => {
      const newData = [...estadoPrevio];
      newData.splice(seleccionarFila, 1);
      setSeleccionarFila(null);
      return newData;
    });
  };

  const editarCelda = (indiceFila, nombreColumna, nuevoValor) => {
    setCsvData((estadoPrevio) => {
      const newData = [...estadoPrevio];
      newData[indiceFila] = {
        ...newData[indiceFila],
        [nombreColumna]: nuevoValor,
      };
      return newData;
    });
  };

  const guardarCambios = async () => {
    if (csvData.length === 0) {
      mostrarAlerta('Por favor, cargue un archivo CSV primero.', 'danger');
      return;
    }
    const convertedData = csvData.map((item) => {
      const convertedItem = {
        grupo: item['Grupo'] || '',
      };
      return convertedItem;
    }).filter(item => Object.values(item).some(value => value !== ''));

    convertedData.sort((a, b) => a.grupo.localeCompare(b.grupo));

    try {
      const duplicates = convertedData.filter(item =>
        existeDato.some(existingItem =>
          existingItem.grupo === item.grupo
        )
      );

      if (duplicates.length > 0) {
        const mensaje = `Se encontraron registros duplicados:\n\n${JSON.stringify(duplicates, null, 2)}`;
        alert(mensaje);
        return;
      }

      const urlGCL = `${BASE_PATH}${RouteGCL}`;
      await axios.post(urlGCL, convertedData, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log('Todos los datos se han enviado correctamente');
    } catch (error) {
      console.error(error);
    }

    setJsonData(convertedData);
    enviarDatos(convertedData);
    localStorage.setItem('csvData', JSON.stringify(convertedData));
    setMensaje('Datos guardados correctamente');
    setMostrarModal(true);
  };

  const enviarDatos = (datos) => {
    console.log('Datos enviados:', datos);
    setCsvData(datos);
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => {
      setAlerta(null);
    }, 3000);
  };

  const alternarModal = () => {
    setMostrarModal(!mostrarModal);
  };

  return {
    seleccionadoArchivo,
    csvData,
    seleccionarFila,
    jsonData,
    alerta,
    mensaje,
    manejarCarga,
    manejarClickFila,
    agregarFila,
    eliminarFila,
    editarCelda,
    guardarCambios,
    mostrarModal,
    alternarModal
  };
}

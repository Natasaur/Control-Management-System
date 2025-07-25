import { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import Cookies from "js-cookie";
import { ENV } from '../../utils/Constants';

export function useCsvTabla() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteACL = ENV.API_ROUTES.LvPC6YcWZOZ7tcfI4Jm3Vc7bbkwqsOROzgla21fVBhXvcZXQZdaECLA;
    const [seleccionadoArchivo, setSeleccionadoArchivo] = useState(false);
    const [csvData, setCsvData] = useState([]);
    const [seleccionarFila, setSeleccionarFila] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [alerta, setAlerta] = useState(null);
    const token = Cookies.get('token');
    const requiredColumns = ["Matricula", "Grupo", "Ciclo escolar", "Fecha"];


    const manejarCargaCsv = (evento) => {
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
                mostrarAlerta("El archivo CSV debe contener las siguientes columnas en el siguiente orden: Matricula, Grupo, Ciclo escolar, Fecha.", "danger");
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
            'Matricula': 'valor 1',
            'Grupo': 'valor 2',
            'Ciclo escolar': 'valor 3',
            'Fecha': 'valor 4',
        };
        setCsvData((estadoPrevio) => [...estadoPrevio, nuevaFila]);
        enviarDatos([...csvData, nuevaFila]);
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
            mostrarAlerta("Por favor, cargue un archivo CSV primero.", "danger");
            return;
        }
    
        const hasAllRequiredColumns = csvData.every((item) => {
            const hasColumns = requiredColumns.every((col) => col in item && item[col] !== "");
            if (!hasColumns) {
                alert("Columnas faltantes o vacías en el siguiente item:\n" + JSON.stringify(item, null, 2));
            }
            return hasColumns;
        });
    
        if (!hasAllRequiredColumns) {
            mostrarAlerta("El archivo CSV debe contener las siguientes columnas: Matricula, Nombre, Apellido paterno, Apellido materno, Plantel, Correo y Rol, y no deben estar vacías.", "danger");
            return;
        }
    
        const convertedData = csvData.map((item) => {
            const convertedItem = {
                matricula: item['Matricula'] || '',
                grupo: item['Grupo'] || '',
                ciclo_escolar: item['Ciclo escolar'] || '',
                fecha: item['Fecha'] || '',
                tipo_asistencia: 'normal',
            };
    
            // Formatear la fecha a "dd/MM/yyyy"
            const dateParts = convertedItem.fecha.split('/');
            if (dateParts.length === 3) {
                const [day, month, year] = dateParts;
                convertedItem.fecha = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year.padStart(4, '0')}`;
            }
    
            return convertedItem;
        }).filter(item => Object.values(item).some(value => value !== ''));
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaActual.getFullYear().toString();
        const fechaActualFormateada = `${dia}/${mes}/${anio}`;
    
        // Verificar si la fecha seleccionada es válida (no es anterior ni posterior a la fecha actual)
        const invalidDates = convertedData.filter((item) => item.fecha !== fechaActualFormateada);
    
        if (invalidDates.length > 0) {
            mostrarAlerta("Error: No se puede guardar una asistencia en fechas anteriores o posteriores al día actual.", "danger");
            return;
        }
    
        convertedData.sort((a, b) => a.grupo.localeCompare(b.grupo));
    
        try {
            const urlACL = `${BASE_PATH}${RouteACL}`;
            await axios.post(urlACL, convertedData, {
                headers: {
                    Authorization: token,
                },
            });
    
            setMensaje('Datos guardados correctamente');
            setMostrarModal(true);
        } catch (error) {
            mostrarAlerta("Error al guardar los datos por fechas duplicado. Por favor, inténtelo de nuevo.", "danger");
        }
    };
    

    const enviarDatos = (datos) => {
        console.log('Datos enviados:', datos);
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
        mostrarModal,
        mensaje,
        alerta,
        manejarCargaCsv,
        manejarClickFila,
        agregarFila,
        eliminarFila,
        editarCelda,
        guardarCambios,
        alternarModal,
        jsonData
    };
}
import { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../utils/Constants';

export function useCsvTablaFunctionsA() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteAT = ENV.API_ROUTES.rP2cqUJM5x56b5bbkrOiyxbN6woiXAOAS;
    const RouteACL = ENV.API_ROUTES.JRftGUGV34Ke1dlVMa2PIOk1tVu7quMgkD7gcP88PUR16qL2CUCRLA;
    const [seleccionadoArchivo, setSeleccionadoArchivo] = useState(false);
    const [csvData, setCsvData] = useState([]);
    const [seleccionarFila, setSeleccionarFila] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [alerta, setAlerta] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const token = Cookies.get('token');
    const requiredColumns = ["Matricula", "Nombre", "Apellido paterno", "Apellido materno", "Grupo", "Ciclo escolar", "Contacto"];

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
            mostrarAlerta("El archivo CSV debe contener las siguientes columnas: Matricula, Nombre, Apellido paterno, Apellido materno, Grupo, Ciclo escolar y Contacto.", "danger");
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
            'Matrícula': 'valor 1',
            'Nombre': 'valor 2',
            'Apellido paterno': 'valor 3',
            'Apellido materno': 'valor 4',
            'Grupo': 'valor 5',
            'Ciclo escolar': 'valor 6',
            'Contacto': 'valor 7',
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
                mostrarAlerta("Columnas faltantes o vacías en el siguiente item:\n" + JSON.stringify(item, null, 2));
            }
            return hasColumns;
        });
    
        if (!hasAllRequiredColumns) {
            mostrarAlerta("El archivo CSV debe contener las siguientes columnas: Matricula, Nombre, Apellido paterno, Apellido materno, Grupo, Ciclo escolar y Contacto, y no deben estar vacías.", "danger");
            return;
        }
        const convertedData = csvData.map((item) => {
            let convertedItem = {
                matricula: item['Matricula'] || '',
                nombre: item['Nombre'] || '',
                apellido_paterno: item['Apellido paterno'] || '',
                apellido_materno: item['Apellido materno'] || '',
                grupo: item['Grupo'] || '',
                ciclo_escolar: item['Ciclo escolar'] || '',
                contacto: item['Contacto'] || '',
            };
            return convertedItem;
        }).filter(item => Object.values(item).some(value => value !== ''));

        // Acomodar los datos alfabéticamente por apellido paterno
        convertedData.sort((a, b) => a.apellido_paterno.localeCompare(b.apellido_paterno));

        try {
            // Obtener los datos existentes de la API
            const urlAT = `${BASE_PATH}${RouteAT}`;
            const response = await axios.get(urlAT, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            const existingData = response.data;

            // Verificar si los datos existentes ya contienen la misma matrícula o correo
            const duplicates = convertedData.filter(item =>
                existingData.some(existingItem =>
                    existingItem.matricula === item.matricula
                )
            );

            if (duplicates.length > 0) {
                // Mostrar una alerta con los datos duplicados
                const mensaje = `Se encontraron registros duplicados:\n\n${JSON.stringify(duplicates, null, 2)}`;
                alert(mensaje);
                return;
            }
            const urlACL = `${BASE_PATH}${RouteACL}`;
            await axios.post(urlACL, convertedData, {
                headers: {
                    Authorization: `${token}`,
                },
            });
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
        alerta,
        mensaje,
        mostrarModal,
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

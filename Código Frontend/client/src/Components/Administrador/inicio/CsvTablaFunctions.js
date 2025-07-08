import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import Cookies from "js-cookie";
import { ENV } from "../../../utils/Constants";

export function useCsvTabla() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteUCL = ENV.API_ROUTES.NFOflvkVgbgyooWKYxGmXPfJTwu5gXhRMeIqGJCvgfAWevs2MQzCLU;
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [csvData, setCsvData] = useState([]);
    const [seleccionarFila, setSeleccionarFila] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [alerta, setAlerta] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const token = Cookies.get("token");
    const requiredColumns = ["Matricula", "Nombre", "Apellido paterno", "Apellido materno", "Plantel", "Correo", "Rol"];


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
                mostrarAlerta("El archivo CSV debe contener las siguientes columnas en el siguiente orden: Matricula, Nombre, Apellido paterno, Apellido materno, Plantel, Correo y Rol.", "danger");
                return;
            }
    
            // Filtrar filas con todos los campos completos
            const filteredData = data.filter((item) => requiredColumns.every((col) => col in item && item[col].trim() !== ""));
            setCsvData(filteredData);
    
            setIsFileSelected(true);
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
            mostrarAlerta("Por favor, cargue un archivo CSV primero.", "danger");
            return;
        }
        const nuevaFila = {
            Matricula: "valor 1",
            Nombre: "valor 2",
            "Apellido paterno": "valor 3",
            "Apellido materno": "valor 4",
            Plantel: "valor 5",
            Correo: "valor 6",
            Rol: "valor 7",
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
    
        let convertedData = csvData
            .map((item) => {
                const convertedItem = {
                    matricula: item["Matricula"] || "",
                    nombre: item["Nombre"] || "",
                    apellido_paterno: item["Apellido paterno"] || "",
                    apellido_materno: item["Apellido materno"] || "",
                    plantel: item["Plantel"] || "",
                    correo: item["Correo"] || "",
                    rol: item["Rol"] || "",
                };
                switch (convertedItem.rol) {
                    case "Consultor":
                        convertedItem.rol = "C";
                        break;
                    case "Administrador de apoyo":
                        convertedItem.rol = "AP";
                        break;
                    case "Usuario":
                        convertedItem.rol = "U";
                        break;
                    default:
                        break;
                }
    
                const plantelConversion = {
                    Atizapán: "A",
                    Ecatepec: "E",
                    Havre: "V",
                    Ixtapaluca: "X",
                    Iztapalapa: "I",
                    Reyes: "R",
                    Neza: "N",
                    Toluca: "T",
                    Toreo: "S",
                    "Zona Rosa": "Z",
                    Coacalco: "C",
                    Cuautitlán: "U",
                    Chalco: "H",
                    Online: "D",
                };
                const plantelValue = convertedItem.plantel.trim();
                if (plantelConversion.hasOwnProperty(plantelValue)) {
                    convertedItem.plantel = plantelConversion[plantelValue];
                } else {
                    console.warn(`Valor de plantel desconocido: ${plantelValue}`);
                }
    
                return convertedItem;
            })
            .filter((item) => Object.values(item).some((value) => value !== ""));
    
        convertedData.sort((a, b) =>
            a.apellido_paterno.localeCompare(b.apellido_paterno)
        );
        
        // Deteción de duplicados en el CSV importado
        const duplicatesInCsv = convertedData.filter((item, index) =>
        convertedData.findIndex(
            (otherItem) =>
                otherItem.matricula.toLowerCase() === item.matricula.toLowerCase() ||
                otherItem.correo.toLowerCase() === item.correo.toLowerCase()
        ) !== index
    );

    if (duplicatesInCsv.length > 0) {
        const mensaje = `Se encontraron registros duplicados en el CSV:\n\n${JSON.stringify(
            duplicatesInCsv,
            null,
            2
        )}`;
        mostrarAlerta(mensaje, "danger");
        return;
    }

    try {

        const urlUCL = `${BASE_PATH}${RouteUCL}`;
        await axios.post(urlUCL, convertedData, {
            headers: {
                Authorization: `${token}`,
            },
        });

        setMensaje("Datos guardados correctamente");
        setMostrarModal(true);
    } catch (error) {
        console.error(error);
        mostrarAlerta("Error al guardar los datos por usuarios duplicado. Por favor, inténtelo de nuevo.", "danger");
    }
};
    
    const enviarDatos = (datos) => {
        mostrarAlerta("Datos enviados:", datos);
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
        isFileSelected,
        csvData,
        seleccionarFila,
        mostrarModal,
        alerta,
        mensaje,
        manejarCargaCsv,
        manejarClickFila,
        agregarFila,
        eliminarFila,
        editarCelda,
        guardarCambios,
        alternarModal,
        jsonData,
    };
}

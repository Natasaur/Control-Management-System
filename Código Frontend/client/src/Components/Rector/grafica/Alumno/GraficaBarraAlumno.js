import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import Cookies from 'js-cookie';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { ENV } from '../../../../utils/Constants';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const GraficaBarraAlumno = () => {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteAT = ENV.API_ROUTES.rP2cqUJM5x56b5bbkrOiyxbN6woiXAOAS;
    const RouteABPA = ENV.API_ROUTES.xW7RTiz5aMgFSYOWMNXJ0NwyZH1EeU944IHll5kE7qn05NSTbigPAA;
    const chartRef = useRef(null);
    const [data, setData] = useState([]);
    const [matriculaSeleccionado, setMatriculaSeleccionado] = useState(null);
    const [datosMatricula, setDatosMatricula] = useState(null);
    const [semanaSeleccionada, setSemanaSeleccionada] = useState('');
    const token = Cookies.get('token');
    const chartInstanceRef = useRef(null);
    const createChart = () => {
        const ctx = chartRef.current.getContext('2d');

        const backgroundColors = generateRandomColors(data.length);
        const borderColors = backgroundColors.map((color) => color.replace('0.2', '1'));

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map((item) => item.nombre),
                datasets: [
                    {
                        label: 'Porcentaje de Asistencia',
                        data: data.map((item) => item.porcentajeAsistencia),
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
                elements: {
                    bar: {
                        backgroundColor: 'blue',
                    },
                },
            },
        });
    };

    const generateRandomColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            const color = `rgba(${r}, ${g}, ${b}, 0.8)`;
            colors.push(color);
        }
        return colors;
    };

    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Datos de alumno');

            worksheet.addRow([
                'Alumno',
                'Apellido paterno',
                'Apellido materno',
                'Porcentaje de Asistencia',
                'Asistencias Maximas',
                'Asistencias Registradas',
            ]);

            data.forEach((item) => {
                worksheet.addRow([
                    item.nombre,
                    item.apellido_paterno,
                    item.apellido_materno,
                    item.porcentajeAsistencia,
                    item.asistenciasMaximas,
                    item.asistenciasRegistradas,
                ]);
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = chartRef.current.width;
            canvas.height = chartRef.current.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(chartRef.current, 0, 0);

            const imageBase64 = canvas.toDataURL('image/png');

            const imageId = workbook.addImage({
                base64: imageBase64,
                extension: 'png',
            });
            worksheet.addImage(imageId, 'N1:Y20');

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.xlsx';
            a.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
        }
    };

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(12);

            const headerBackgroundColor = '#011F5D';
            const headerHeight = 20;

            doc.setFillColor(headerBackgroundColor);
            doc.rect(0, 0, doc.internal.pageSize.getWidth(), headerHeight, 'F');

            const title = 'Reporte de Asistencia'; 
            const titleFontSize = 20; 
            const titleTextColor = '#FFFFFF'; 

            const textWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor; 
            const textX = (doc.internal.pageSize.getWidth() - textWidth) / 1.4;

            doc.setFontSize(titleFontSize);
            doc.setTextColor(titleTextColor);
            doc.text(title, textX, headerHeight / 2, { align: 'center', baseline: 'middle' }); 

            const tableLegend = 'Tabla de Asistencia';
            const tableLegendX = 80;
            const tableLegendY = headerHeight + 25;

            doc.setFontSize(14);
            doc.setTextColor('#000000'); 
            doc.text(tableLegend, tableLegendX, tableLegendY); 

            const headers = [
                'Alumno',
                'Apellido paterno',
                'Apellido materno',
                'Porcentaje de Asistencia',
                'Asistencias Maximas',
                'Asistencias Registradas',

            ];

            const tableData = data.map((item) => [
                item.nombre,
                item.apellido_paterno,
                item.apellido_materno,
                item.porcentajeAsistencia,
                item.asistenciasMaximas,
                item.asistenciasRegistradas,
            ]);

            const startY = tableLegendY + 10;
            const tableOptions = {
                head: [headers],
                body: tableData,
                startY,
                theme: 'striped',
            };
            const table = doc.autoTable(tableOptions);

            const tableHeight = table.autoTable.previous.finalY || 0;
            const tableY = tableHeight + 10;

            const imageLegend = 'Gráfica de Asistencia';
            const imageLegendX = 80; 
            const imageLegendY = tableY + 10; 

            doc.setFontSize(14); 
            doc.setTextColor('#000000'); 
            doc.text(imageLegend, imageLegendX, imageLegendY);

            const canvas = chartRef.current;
            const imageData = canvas.toDataURL('image/png');

            const containerWidth = 150; 
            const containerHeight = 100; 
            const containerX = (doc.internal.pageSize.getWidth() - containerWidth) / 2;
            const containerY = imageLegendY + 15; 
            const containerBackgroundColor = '#FFFFFF'; 
            const containerBorderColor = '#cccccc'; 
            const containerBorderWidth = 1; 

            doc.setFillColor(containerBackgroundColor); 
            doc.setDrawColor(containerBorderColor); 
            doc.setLineWidth(containerBorderWidth); 
            doc.rect(containerX, containerY, containerWidth, containerHeight, 'FD'); 

            const imageX = containerX + 5; 
            const imageY = containerY + 5; 
            const imageWidth = containerWidth - 10; 
            const imageHeight = containerHeight - 10;

            doc.addImage(imageData, 'PNG', imageX, imageY, imageWidth, imageHeight, '', 'FAST');

            const footerBackgroundColor = '#FD7E14'; 
            const footerHeight = 20; 

            doc.setFillColor(footerBackgroundColor); 
            doc.rect(0, doc.internal.pageSize.getHeight() - footerHeight, doc.internal.pageSize.getWidth(), footerHeight, 'F'); 

            doc.save('data.pdf');
        } catch (error) {
            console.error('Error al exportar a PDF:', error);
        }
    };

    const guardarMatriculaSeleccionado = (selectedOption) => {
        if (selectedOption !== null) {
            const matriculaSeleccionadoValor = selectedOption.value;
            setMatriculaSeleccionado(matriculaSeleccionadoValor);
            console.log('Matrícula seleccionada:', matriculaSeleccionadoValor);
        } else {
            setMatriculaSeleccionado(null);
        }
    };

    const fetchData = async () => {
        try {
            const urlAT = `${BASE_PATH}${RouteAT}`;
            const response = await axios.get(urlAT, {
                headers: {
                    Authorization: token,
                },
            });
            const data = response.data;
            setDatosMatricula(data);

            if (semanaSeleccionada !== '' && matriculaSeleccionado !== null) {
                const urlABPA = `${BASE_PATH}${RouteABPA}`;
                const requestData = {
                    semana: semanaSeleccionada,
                    matricula: matriculaSeleccionado,
                };
                console.log(requestData);
                const response = await axios.post(urlABPA, requestData, {
                    headers: {
                        Authorization: token,
                    },
                });
                const apiData = response.data;
                apiData.semana = semanaSeleccionada;
                setData([apiData]);
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        fetchData();
    }, [token, semanaSeleccionada, matriculaSeleccionado]);

    useEffect(() => {
        if (data.length > 0) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            createChart();
        }
    }, [data]);

    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    const manejarCambioSemana = (event) => {
        const seleccionar = event.target.value;
        setSemanaSeleccionada(seleccionar);
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <Select
                        options={
                            datosMatricula
                                ? datosMatricula.map((option) => ({
                                    value: option.matricula,
                                    label: option.matricula,
                                }))
                                : []
                        }
                        value={
                            matriculaSeleccionado
                                ? { value: matriculaSeleccionado, label: matriculaSeleccionado }
                                : null
                        }
                        onChange={guardarMatriculaSeleccionado}
                        placeholder="Seleccionar matrícula"
                    />
                </div>
                <div className="col-md-6">
                    <Form.Select onChange={manejarCambioSemana}>
                        <option value="">Seleccionar semana</option>
                        <option value="1">Semana 1</option>
                        <option value="2">Semana 2</option>
                        <option value="3">Semana 3</option>
                        <option value="4">Semana 4</option>
                        <option value="5">Semana 5</option>
                    </Form.Select>
                </div>
            </div>
            <canvas ref={chartRef} />
                <button onClick={exportToExcel} disabled={!matriculaSeleccionado || !semanaSeleccionada}>
                <span>Exportar a Excel </span><FontAwesomeIcon icon={faFileExcel} />
                </button>
                <button onClick={exportToPDF} disabled={!matriculaSeleccionado || !semanaSeleccionada}>
                <span>Exportar a PDF </span><FontAwesomeIcon icon={faFilePdf} />
                </button>

        </div>
    );
};

export default GraficaBarraAlumno;

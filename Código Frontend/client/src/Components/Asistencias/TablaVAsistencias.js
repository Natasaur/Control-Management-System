import React, { useMemo } from 'react';
import { Card, Table, Form, Button, Modal, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useVisualizarAFunctions from './VisualizarAFunctions';
import { format, eachDayOfInterval } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useEffect } from 'react';

export default function TablaAsistencias() {
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        try {
            return format(new Date(fecha), 'yyyy-MM-dd');
        } catch (error) {
            console.warn('Fecha inválida detectada:', fecha);
            return '';
        }
    };

    const {
        filtroAplicado,
        grupos,
        alumnos,
        grupo,
        setGrupo,
        fechaInicio,
        fechaFin,
        setFechaInicio,
        setFechaFin,
        asistencias,
        showConfirmModal,
        handleEliminarAsistencia,
        handleCerrarModal,
        mensajeEliminacion,
        obtenerAsistencias,
        isLoading,
        obtenerAlumnosPorGrupo,
    } = useVisualizarAFunctions();

    
    useEffect(() => {
        if (grupo) {
            obtenerAlumnosPorGrupo(grupo);
        }
    }, [grupo, obtenerAlumnosPorGrupo]);

    const fechasEnRango = useMemo(() => {
        if (!fechaInicio || !fechaFin) return [];
        return eachDayOfInterval({ start: fechaInicio, end: fechaFin });
    }, [fechaInicio, fechaFin]);

    const asistenciaPorAlumno = useMemo(() => {
        const agrupado = {};
        alumnos.forEach((a) => {
            agrupado[a.matricula] = {
                nombreCompleto: `${a.nombre} ${a.apellido_paterno} ${a.apellido_materno}`.trim(),
                asistencias: {}
            };
        });
        asistencias.forEach((a) => {
            const fechaFormateada = formatearFecha(a.fecha);
            if (!agrupado[a.matricula]) return;
            agrupado[a.matricula].asistencias[fechaFormateada] = a.tipo_asistencia;
        });
        return agrupado;
    }, [asistencias, alumnos]);

    const handleDescargarPDF = async () => {
        const input = document.getElementById('tabla-asistencia-imprimible');
        if (!input) return;

        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('asistencia.pdf');
    };

    const handleDescargarExcel = () => {
        const headers = ['Matrícula', 'Nombre', ...fechasEnRango.map(f => format(f, 'yyyy-MM-dd'))];
        const data = Object.entries(asistenciaPorAlumno).map(([matricula, datos]) => {
            const fila = [matricula, datos.nombreCompleto];
            fechasEnRango.forEach(fecha => {
                const fechaStr = format(fecha, 'yyyy-MM-dd');
                const tipo = datos.asistencias[fechaStr];
                fila.push(tipo === 'normal' ? '✓' : tipo === 'justificada' ? 'J' : '');
            });
            return fila;
        });

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'asistencia.xlsx');
    };

    return (
        <Card>
            <div>
                <h3 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Asistencias</h3>
            </div>
            <Card.Header className="d-flex flex-wrap gap-2 justify-content-start">
                <Form.Label>Fecha Inicio</Form.Label>
                <DatePicker selected={fechaInicio} onChange={setFechaInicio} dateFormat="yyyy-MM-dd" className="form-control" />
                <Form.Label>Fecha Fin</Form.Label>
                <DatePicker selected={fechaFin} onChange={setFechaFin} dateFormat="yyyy-MM-dd" className="form-control" />
                <Form.Select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                    <option value="">Todos los grupos</option>
                    {grupos.map((g) => (
                        <option key={g._id} value={g.grupo}>{g.grupo}</option>
                    ))}
                </Form.Select>
                <Button onClick={() => {
                    if (!grupo || !fechaInicio || !fechaFin) {
                        alert("Selecciona grupo y rango de fechas.");
                        return;
                    }
                    obtenerAsistencias({
                        grupo,
                        fechaInicio: fechaInicio.toISOString(),
                        fechaFin: fechaFin.toISOString()
                    });
                }}>
                    Filtrar
                </Button>
                {isLoading && <Spinner animation="border" variant="primary" size="sm" className="ml-2" />}
            </Card.Header>

            <Card.Body>
                {mensajeEliminacion && <p className="text-success">{mensajeEliminacion}</p>}
                {!filtroAplicado ? (
                    <p className="text-center">Selecciona grupo y rango de fechas, luego presiona <strong>Filtrar</strong>.</p>
                ) : asistencias.length === 0 ? (
                    <p className="text-center">No hay asistencias registradas.</p>
                ) : (
                    <>
                        <div className="text-center mb-3">
                            <h5>Grupo: {grupo || 'Todos'}</h5>
                            <p>Del: <strong>{formatearFecha(fechaInicio)}</strong> al <strong>{formatearFecha(fechaFin)}</strong></p>
                        </div>

                        <div className="d-flex justify-content-center gap-3 mb-3">
                            <Button variant="secondary" onClick={() => window.print()}>Imprimir</Button>
                            <Button variant="danger" onClick={handleDescargarPDF}>Descargar PDF</Button>
                            <Button variant="success" onClick={handleDescargarExcel}>Descargar Excel</Button>
                        </div>

                        <div id="tabla-asistencia-imprimible" style={{ overflowX: 'auto' }}>
                            <Table bordered responsive striped>
                                <thead>
                                    <tr>
                                        <th>Matrícula</th>
                                        <th>Nombre</th>
                                        {fechasEnRango.map((fecha) => (
                                            <th key={fecha}>{format(fecha, 'yyyy-MM-dd')}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(asistenciaPorAlumno).map(([matricula, datos]) => (
                                        <tr key={matricula}>
                                            <td>{matricula}</td>
                                            <td>{datos.nombreCompleto}</td>
                                            {fechasEnRango.map((fecha) => {
                                                const fechaStr = format(fecha, 'yyyy-MM-dd');
                                                const tipo = datos.asistencias[fechaStr];
                                                return (
                                                    <td key={fechaStr}>
                                                        {tipo === 'normal' ? '✓' : tipo === 'justificada' ? 'J' : ''}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </>
                )}
            </Card.Body>

            <Modal show={showConfirmModal} onHide={handleCerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas eliminar esta asistencia?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCerrarModal}>Cancelar</Button>
                    <Button variant="danger" onClick={handleEliminarAsistencia}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}
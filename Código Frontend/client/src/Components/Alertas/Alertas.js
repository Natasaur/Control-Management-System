import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { AlertasFunctions } from "./AlertasFunctions";

const styles = StyleSheet.create({
    page: { backgroundColor: "#fff", padding: "1cm" },
    header: {
        marginBottom: "1cm",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "2cm",
        backgroundColor: "red",
    },
    title: { fontSize: 18, fontWeight: "bold", color: "#fff" },
    listItem: { marginBottom: "0.5cm" },
});

const Alertas = () => {
    const [plantelSeleccionado, setPlantelSeleccionado] = useState("");
    const [rangoFechas, setRangoFechas] = useState({ fechaInicio: "", fechaFin: "" });
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const manejarCambioFecha = (campo, valor) => {
        setRangoFechas(prev => ({
            ...prev,
            [campo === "inicio" ? "fechaInicio" : "fechaFin"]: valor,
        }));
    };

    const { alertas, mostrarBotonDescarga, obtenerAlertas } = AlertasFunctions();

    const handleObtenerAlertas = () => {
        obtenerAlertas(rangoFechas.fechaInicio, rangoFechas.fechaFin, plantelSeleccionado);
        setBusquedaRealizada(true);
    };

    return (
        <Card>
            <div>
                <h3 className="text-center mb-4" style={{ backgroundColor: '#B81414', color: 'white', padding: '10px' }}>Alertas</h3>
            </div>
            <Card.Body>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <Form.Select value={plantelSeleccionado} onChange={e => setPlantelSeleccionado(e.target.value)}>
                            <option value="">Seleccionar plantel</option>
                            <option value="A">ATIZAPAN</option>
                            <option value="E">ECATEPEC</option>
                            <option value="V">HAVRE</option>
                            <option value="X">IXTAPALUCA</option>
                            <option value="I">IZTAPALAPA</option>
                            <option value="R">LOS REYES</option>
                            <option value="N">NEZA</option>
                            <option value="T">TOLUCA</option>
                            <option value="S">TOREO</option>
                            <option value="Z">ZONA ROSA</option>
                            <option value="C">COACALCO</option>
                            <option value="U">CUAUTITLAN</option>
                            <option value="H">CHALCO</option>
                        </Form.Select>
                    </div>
                    <div className="col-md-3">
                        <Form.Label>Fecha inicio</Form.Label>
                        <Form.Control
                            type="date"
                            value={rangoFechas.fechaInicio}
                            onChange={e => manejarCambioFecha("inicio", e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <Form.Label>Fecha fin</Form.Label>
                        <Form.Control
                            type="date"
                            value={rangoFechas.fechaFin}
                            onChange={e => manejarCambioFecha("fin", e.target.value)}
                        />
                    </div>
                </div>

                <div className="row mb-3 d-flex justify-content-center gap-2">
                    {mostrarBotonDescarga && (
                        <div className="col-md-3 d-flex align-items-center justify-content-center">
                            <PDFDownloadLink
                                document={
                                    <Document>
                                        <Page style={styles.page}>
                                            <View style={styles.header}>
                                                <Text style={styles.title}>Alertas</Text>
                                            </View>
                                            {alertas.map((alerta, i) => (
                                                <View key={i} style={styles.listItem}>
                                                    <Text>Nombre: {alerta.nombre} {alerta.apellido_paterno} {alerta.apellido_materno}</Text>
                                                    <Text>Matrícula: {alerta.matricula}</Text>
                                                    <Text>Grupo: {alerta.grupo}</Text>
                                                    <Text>Contacto: {alerta.contacto || "N/A"}</Text>
                                                    <Text>Número de faltas: {alerta.numero_faltas}</Text>
                                                    <Text>Fechas faltantes:</Text>
                                                    {alerta.fechas_faltantes.map((fecha, idx) => (
                                                        <Text key={idx}>{fecha}</Text>
                                                    ))}
                                                </View>
                                            ))}
                                        </Page>
                                    </Document>
                                }
                                fileName="alertas.pdf"
                            >
                                {({ loading }) => (
                                    <button className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? "Generando PDF..." : "Descargar PDF"}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    )}
                    <div className="col-md-2">
                        <button
                            className="btn btn-danger w-100"
                            onClick={() => handleObtenerAlertas()}
                            disabled={!rangoFechas.fechaInicio || !rangoFechas.fechaFin}
                        >
                            Obtener alertas
                        </button>
                    </div>
                </div>

                {alertas.length > 0 ? (
                    <ul className="list-group mb-3">
                        {alertas.map((alerta, i) => (
                            <li className="list-group-item" key={i}>
                                <p><strong>Nombre:</strong> {alerta.nombre} {alerta.apellido_paterno} {alerta.apellido_materno}</p>
                                <p><strong>Matrícula:</strong> {alerta.matricula}</p>
                                <p><strong>Grupo:</strong> {alerta.grupo}</p>
                                <p><strong>Contacto:</strong> {alerta.contacto || "N/A"}</p>
                                <p><strong>Número de faltas:</strong> {alerta.numero_faltas}</p>
                                <p><strong>Fechas faltantes:</strong></p>
                                <ul>
                                    {alerta.fechas_faltantes.map((fecha, idx) => (
                                        <li key={idx}>{fecha}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    busquedaRealizada && <p>No se encontraron alertas.</p>
                )}

            </Card.Body>
        </Card>
    );
};

export default Alertas;
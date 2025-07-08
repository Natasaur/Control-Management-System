import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { AlertasFunctions } from './AlertasFunctions';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: '1cm',
    },
    header: {
        marginBottom: '1cm',
        borderBottom: '1px solid #cccccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '2cm',
        backgroundColor: 'red',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    listItem: {
        marginBottom: '0.5cm',
    },
});

const Alertas = () => {
    const {
        alertas,
        mostrarBotonDescarga,
        manejarCambio,
        manejarCambioSemana,
        obtenerAlertas
    } = AlertasFunctions();

    return (
        <Card>
            <Card.Body>
            <div className="row">
                <div className="col-md-6">
                    <Form.Select onChange={manejarCambio}>
                        <option value="">Seleccionar plantel</option>
                        <option value="A">Atizapán</option>
                        <option value="E">Ecatepec</option>
                        <option value="V">HAVRE</option>
                        <option value="X">Ixtapaluca</option>
                        <option value="I">Iztapalapa</option>
                        <option value="R">Los Reyes</option>
                        <option value="N">NEZA</option>
                        <option value="T">Toluca</option>
                        <option value="S">Toreo</option>
                        <option value="Z">Zona Rosa</option>
                        <option value="C">COACALCO</option>
                        <option value="U">CUAUTITLAN</option>
                        <option value="H">CHALCO</option>
                    </Form.Select>
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
            {alertas.length > 0 && alertas[0].fechas_asistencias.length > 0 && (
                <>
                    <p>Fechas de Asistencias:</p>
                    <p>
                        {alertas[0].fechas_asistencias.map((fecha, index) => (
                            <span key={index}>
                                {fecha}
                                <br />
                            </span>
                        ))}
                    </p>
                </>
            )}
            <div>
                {alertas.length > 0 ? (
                    <ul className="list-group">
                        {alertas.map((alerta, index) => (
                            <li className="list-group-item" key={index}>
                                <h5>{alerta.titulo}</h5>
                                <p>{alerta.contenido}</p>
                                <p>Nombre: {alerta.nombre}</p>
                                <p>Apellido Paterno: {alerta.apellido_paterno}</p>
                                <p>Apellido Materno: {alerta.apellido_materno}</p>
                                <p>Matricula: {alerta.matricula}</p>
                                <p>Grupo: {alerta.grupo}</p>
                                <p>Contacto: {alerta.contacto}</p>
                                <p>
                                    Fechas Asistidas:{' '}
                                    {alerta.fechas_asistidas.map((fecha, index) => (
                                        <span key={index}>
                                            {fecha}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No se encontraron alertas.</p>
                )}
                {mostrarBotonDescarga && (
                    <PDFDownloadLink
                        document={
                            <Document>
                                <Page>
                                    <View style={styles.page}>
                                        <View style={styles.header}>
                                            <Text style={styles.title}>Alertas</Text>
                                        </View>
                                        {alertas.map((alerta, index) => (
                                            <View key={index} style={styles.listItem}>
                                                <Text>{alerta.titulo}</Text>
                                                <Text>{alerta.contenido}</Text>
                                                <Text>Nombre: {alerta.nombre}</Text>
                                                <Text>Apellido Paterno: {alerta.apellido_paterno}</Text>
                                                <Text>Apellido Materno: {alerta.apellido_materno}</Text>
                                                <Text>Matricula: {alerta.matricula}</Text>
                                                <Text>Grupo: {alerta.grupo}</Text>
                                                <Text>Contacto: {alerta.contacto}</Text>
                                                <Text>
                                                    Fechas Asistidas:{' '}
                                                    {alerta.fechas_asistidas.map((fecha, index) => (
                                                        <Text key={index}>{fecha}</Text>
                                                    ))}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </Page>
                            </Document>
                        }
                        fileName="alertas.pdf"
                    >
                        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
                    </PDFDownloadLink>
                )}
            </div>
            </Card.Body>
            <Card.Footer>
                <div className="d-flex justify-content-center align-items-center">
                    <button className="btn btn-danger" onClick={obtenerAlertas}>Obtener alertas</button>
                </div>
            </Card.Footer>
        </Card>
    );
};

export default Alertas;

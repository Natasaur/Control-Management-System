import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import Margen from '../../Extras/MargenRector';
import GraficaBarraCarrera from '../grafica/Carrera/GraficaBarrasCarrera';
import GraficaBarraCuatrimestre from '../grafica/Cuatrimestre/GraficaBarraCuatrimestre';
import GraficaBarraPlantel from '../grafica/Plantel/GraficaBarraPlantel';
import GraficaBarraTurno from '../grafica/Turno/GraficaBarrasTurno';
import GraficaBarraGrupo from '../grafica/Grupos/GraficaBarraGrupos';
import GraficaBarraAlumno from '../grafica/Alumno/GraficaBarraAlumno';
import Alertas from './Alertas/Alertas';


export default function Rector() {
    return (
        <>
            <Margen />
            <Container>
                <div className="container my-4">
                    <Row style={{ marginBottom: '2rem' }}>
                        <Col md={6}>
                            <Card className="grafica-1">
                                <Card.Header>
                                    <h3>Alumno</h3>
                                </Card.Header>
                                <Card.Body>
                                    <GraficaBarraAlumno />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="grafica-2">
                                <Card.Header>
                                    <h3>Grupo</h3>
                                </Card.Header>
                                <Card.Body>
                                    <GraficaBarraGrupo />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '2rem' }}>
                        <Col md={6}>
                            <Card className="grafica-1">
                                <Card.Header>
                                    <h3>Cuatrimestre</h3>
                                </Card.Header>
                                <Card.Body>
                                    <GraficaBarraCuatrimestre />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="grafica-2">
                                <Card.Header>
                                    <h3>Carrera</h3>
                                </Card.Header>
                                <Card.Body>
                                    <GraficaBarraCarrera />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '2rem' }}>
                        <Col md={6}>
                            <Card className="grafica-1">
                                <Card.Header>
                                    <h3>Turno</h3>
                                </Card.Header>
                                <Card.Body>
                                    <GraficaBarraTurno />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="grafica-2">
                                <Card.Header>
                                    <h3>Plantel</h3>
                                </Card.Header>
                                <Card.Body>
                                    <GraficaBarraPlantel />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Card className="grafica-2">
                        <Card.Header style={{ backgroundColor: 'red', color: 'white' }}>
                            <h3>Alertas</h3>
                        </Card.Header>
                        <Card.Body>
                            <Alertas />
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </>
    );
}

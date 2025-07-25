import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import Margen from '../Extras/MargenRector';
import GraficaBarraCarrera from '../Rector/grafica/Carrera/GraficaBarrasCarrera';
import GraficaBarraCuatrimestre from '../Rector/grafica/Cuatrimestre/GraficaBarraCuatrimestre';
import GraficaBarraPlantel from '../Rector/grafica/Plantel/GraficaBarraPlantel';
import GraficaBarraTurno from '../Rector/grafica/Turno/GraficaBarrasTurno';
import GraficaBarraGrupo from '../Rector/grafica/Grupos/GraficaBarraGrupos';
import GraficaAsistencias from '../Rector/grafica/Asistencias/GraficaAsistencias';
import Alertas from './Alertas/Alertas';
import api from '../../api/axios';

export default function Rector() {
    const [grupos, setGrupos] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [filtros, setFiltros] = useState(null);
    const [loadingGrupos, setLoadingGrupos] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGrupos = async () => {
            try {
                const res = await api.get("/grupo/buscar");
                const soloGrupos = res.data.map((g) => g.grupo);
                setGrupos(soloGrupos);
            } catch (err) {
                console.error(err);
                setError("Error al cargar grupos");
            } finally {
                setLoadingGrupos(false);
            }
        };

        fetchGrupos();
    }, []);

    const handleBuscar = () => {
        if (!grupoSeleccionado || !fechaInicio || !fechaFin) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        setError(null);
        setFiltros({
            grupo: grupoSeleccionado,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
        });
    };

    return (
        <>
            <Margen />
            <Container>
                <div className="container my-4">
                    <Row style={{ marginBottom: '2rem' }}>
                        <Col md={12}>
                        <Card>
                            <Card.Header>Asistencia grupal por día</Card.Header>
                                <Card.Body>
                                    {loadingGrupos && <Spinner animation="border" />}
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        {!loadingGrupos && !error && (
                                            <Form>
                                                <Row>
                                                    <Col md={4}>
                                                        <Form.Group>
                                                            <Form.Label>Grupo</Form.Label>
                                                            <Form.Select
                                                                value={grupoSeleccionado}
                                                                onChange={(e) => setGrupoSeleccionado(e.target.value)}
                                                            >
                                                                <option value="">-- Selecciona Grupo --</option>
                                                                {grupos.map((grupo) => (
                                                                    <option key={grupo} value={grupo}>
                                                                        {grupo}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group>
                                                            <Form.Label>Fecha Inicio</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                value={fechaInicio}
                                                                onChange={(e) => setFechaInicio(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group>
                                                            <Form.Label>Fecha Fin</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                value={fechaFin}
                                                                onChange={(e) => setFechaFin(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={2} className="d-flex align-items-end">
                                                        <Button variant="primary" onClick={handleBuscar}>
                                                            Buscar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    
                    {filtros && (
                        <Row className="mb-4">
                            <Col md={12}>
                                <Card className="grafica-1">
                                    <Card.Header>
                                        <h3>Asistencias y Faltas</h3>
                                    </Card.Header>
                                    <Card.Body>
                                        <GraficaAsistencias
                                            grupo={filtros.grupo}
                                            fechaInicio={filtros.fecha_inicio}
                                            fechaFin={filtros.fecha_fin}
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}


                    <Row style={{ marginBottom: '2rem' }}>
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

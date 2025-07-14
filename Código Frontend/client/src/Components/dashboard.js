import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import api from '../api/axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from 'js-cookie';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // █ ESTADOS GLOBALES
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const [datosBarras, setDatosBarras] = useState(null);
  const [datosPie, setDatosPie] = useState(null);
  const [datosLine, setDatosLine] = useState(null);
  const [datosDoughnut, setDatosDoughnut] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtros
  const [plantelSeleccionado, setPlantelSeleccionado] = useState("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // Catálogos
  const [planteles, setPlanteles] = useState([]);
  const [carrera, setCarreras] = useState([]);

  const chartColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
    "#C9CBCF", "#5A8DEE", "#39DA8A", "#FDAC41", "#FF5B5C", "#00CFDD"
  ];

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // █ CARGA DE CATÁLOGOS
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  useEffect(() => {
    const fetchPlanteles = async () => {
      try {
        const token = Cookies.get("token");
        const res = await api.get("/plantel/obtenerPlanteles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlanteles(res.data);
      } catch (error) {
        console.error(error);
        setError("Error al cargar planteles");
      }
    };

    const fetchCarreras = async () => {
      try {
        const token = Cookies.get("token");
        const res = await api.get("/carrera/obtenerCarreras", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCarreras(res.data);
      } catch (error) {
        console.error(error);
        setError("Error al cargar carreras");
      }
    };

    fetchPlanteles();
    fetchCarreras();
  }, []);

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // █ CARGA DE GRÁFICA DE BARRAS
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const cargarDatosBarras = async (body, token) => {
    const res = await api.post(
      "/asistencia/buscar/porcentaje/plantel",
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    let datos = res.data.datos;

    if (plantelSeleccionado) {
      const nombrePlantel = planteles.find(p => p.clave === plantelSeleccionado)?.nombre;
      datos = datos.filter(item => item.plantel === nombrePlantel);
    }

    const labels = datos.map(item => item.plantel);
    const data = datos.map(item => item.porcentajeAsistencia);

    const colors = labels.map((_, i) => chartColors[i % chartColors.length]);

    setDatosBarras({
      labels,
      datasets: [
        {
          label: '% Asistencias',
          data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        }
      ]
    });
  };

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // █ CARGA DE GRÁFICA DE PIE (Carreras)
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const cargarDatosPie = async (body, token) => {
    const res = await api.post(
      "/asistencia/buscar/porcentaje/carrera",
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const datos = res.data.datos;
    const filtrados = datos.filter(c => c.alumnos > 0);

    const total = filtrados.reduce((sum, c) => sum + c.alumnos, 0);

    const labels = filtrados.map(c => c.carrera);
    const data = total > 0
      ? filtrados.map(c => ((c.alumnos / total) * 100).toFixed(2))
      : [];

    const colors = labels.map((_, i) => chartColors[i % chartColors.length]);

    setDatosPie({
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors
        }
      ]
    });
  };

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // █ CARGA DE GRÁFICA DE LÍNEA
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const cargarDatosLine = async (body, token) => {
    // FUTURO: aquí llamarás a tu nuevo endpoint
    // de evolución de asistencias para la línea.
    // Por ahora datos dummy:
    setDatosLine({
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      datasets: [
        {
          label: 'Asistencias',
          data: [30, 50, 40, 70, 60],
          borderColor: chartColors[0],
          backgroundColor: chartColors[0],
          fill: false
        }
      ]
    });
  };

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // █ CARGA DE GRÁFICA DOUGHNUT
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const cargarDatosDoughnut = () => {
    setDatosDoughnut({
      labels: ['>3 faltas', '≤3 faltas'],
      datasets: [
        {
          data: [20, 80],
          backgroundColor: chartColors.slice(0, 2)
        }
      ]
    });
  };

  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  // █ FUNCIÓN MAESTRA PARA CARGAR TODO
  // ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  const cargarDatos = async () => {
    try {
      setError(null);
      setLoading(true);

      const token = Cookies.get("token");

      const body = {
        fechaInicio: fechaInicio ? fechaInicio.toLocaleDateString("en-CA") : undefined,
        fechaFin: fechaFin ? fechaFin.toLocaleDateString("en-CA") : undefined,
      };

      if (plantelSeleccionado) body.plantel = plantelSeleccionado;
      if (carreraSeleccionada) body.carrera = carreraSeleccionada;

      await Promise.all([
        cargarDatosBarras(body, token),
        cargarDatosPie(body, token),
        cargarDatosLine(body, token),
        cargarDatosDoughnut()
      ]);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error al cargar datos del dashboard.");
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h2 className="mb-4">Dashboard General</h2>
      <Row>
        <Col md={3}>
          <Card>
            <Card.Body>
              <h5>Filtros</h5>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Inicio</Form.Label>
                <DatePicker
                  selected={fechaInicio}
                  onChange={date => setFechaInicio(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Seleccione una fecha"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Fin</Form.Label>
                <DatePicker
                  selected={fechaFin}
                  onChange={date => setFechaFin(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Seleccione una fecha"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Plantel</Form.Label>
                <Form.Select
                  value={plantelSeleccionado}
                  onChange={e => setPlantelSeleccionado(e.target.value)}
                >
                  <option value="">Todos</option>
                  {planteles.map(p => (
                    <option key={p._id} value={p.clave}>
                      {p.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Carrera</Form.Label>
                <Form.Select
                  value={carreraSeleccionada}
                  onChange={e => setCarreraSeleccionada(e.target.value)}
                >
                  <option value="">Todos</option>
                  {carrera.map(p => (
                    <option key={p._id} value={p.clave}>
                      {p.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button
                variant="primary"
                onClick={cargarDatos}
                disabled={!fechaInicio || !fechaFin}
              >
                Aplicar filtros
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          {datosBarras || datosPie || datosLine || datosDoughnut ? (
            <>
              <Row className="mb-4">
                <Card>
                  <Card.Header>Asistencias por Plantel</Card.Header>
                  <Card.Body>
                    <Bar data={datosBarras} options={{ responsive: true }} />
                  </Card.Body>
                </Card>
              </Row>
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Header>Distribución de Carreras</Card.Header>
                    <Card.Body>
                      {datosPie ? (
                        <Pie data={datosPie} options={{ responsive: true }} />
                      ) : (
                        <Alert variant="warning">
                          No hay datos para la gráfica de carreras.
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>Evolución de Asistencias</Card.Header>
                    <Card.Body>
                      <Line data={datosLine} options={{ responsive: true }} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Header>Porcentaje Alumnos con más de 3 Faltas</Card.Header>
                    <Card.Body>
                      <Doughnut data={datosDoughnut} options={{ responsive: true }} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <Alert variant="info" className="mt-3">
              Selecciona un rango de fechas y aplica filtros para ver las gráficas.
            </Alert>
          )}
        </Col>
      </Row>
    </>
  );
}
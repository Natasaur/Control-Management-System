import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

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
  const [datosBarras, setDatosBarras] = useState(null);
  const [datosPie, setDatosPie] = useState(null);
  const [datosLine, setDatosLine] = useState(null);
  const [datosDoughnut, setDatosDoughnut] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Aquí podrías traer datos reales de tus endpoints
      // Ejemplo:
      // const res = await axios.get('/api/dashboard/data');
      // setDatosBarras(res.data.barras);

      // Simulando datos de ejemplo:
      setDatosBarras({
        labels: ['Atizapán', 'Zona Rosa'],
        datasets: [
          {
            label: 'Asistencias',
            data: [120, 90],
            backgroundColor: '#36A2EB'
          }
        ]
      });

      setDatosPie({
        labels: ['INSC', 'INFO', 'INAD'],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      });

      setDatosLine({
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        datasets: [
          {
            label: 'Asistencias',
            data: [30, 50, 40, 70, 60],
            borderColor: '#36A2EB',
            backgroundColor: '#36A2EB',
            fill: false
          }
        ]
      });

      setDatosDoughnut({
        labels: ['>3 faltas', '≤3 faltas'],
        datasets: [
          {
            data: [20, 80],
            backgroundColor: ['#FF6384', '#36A2EB']
          }
        ]
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos del dashboard.');
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h2 className="mb-4">Dashboard General</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Asistencias por Plantel</Card.Header>
            <Card.Body>
              <Bar data={datosBarras} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Distribución de Carreras</Card.Header>
            <Card.Body>
              <Pie data={datosPie} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Evolución de Asistencias</Card.Header>
            <Card.Body>
              <Line data={datosLine} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
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
  );
}
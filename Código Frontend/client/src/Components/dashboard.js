// client/src/Components/dashboard.js

import React from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Dashboard = () => {
  const navigate = useNavigate();

  const nombre = Cookies.get("nombre") || "Usuario";
  const apellidoPaterno = Cookies.get("apellido_paterno") || "";
  const apellidoMaterno = Cookies.get("apellido_materno") || "";
  const rol = Cookies.get("rol") || "";

  const cerrarSesion = () => {
    Cookies.remove("token");
    Cookies.remove("rol");
    Cookies.remove("matricula");
    Cookies.remove("plantel");
    Cookies.remove("nombre");
    Cookies.remove("apellido_paterno");
    Cookies.remove("apellido_materno");

    navigate("/", { replace: true });
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4 justify-content-between align-items-center">
        <Col>
          <h2>
            Bienvenidx {nombre} {apellidoPaterno} {apellidoMaterno}
          </h2>
          <p>Rol: {rol}</p>
        </Col>
        <Col xs="auto">
          <Button variant="danger" onClick={cerrarSesion}>
            Cerrar sesión
          </Button>
        </Col>
      </Row>

      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Administración</Card.Title>
              <Button as={Link} to="/Iniciousuario" variant="primary">
                Ir
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Consultor</Card.Title>
              <Button as={Link} to="/Consultor" variant="primary">
                Ir
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Rector</Card.Title>
              <Button as={Link} to="/Rector" variant="primary">
                Ir
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
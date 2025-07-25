import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function MainLayout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("rol");
    Cookies.remove("matricula");
    Cookies.remove("plantel");
    Cookies.remove("nombre");
    Cookies.remove("apellido_paterno");
    Cookies.remove("apellido_materno");
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">
            Control Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/asistencias/manual" className="text-white text-decoration-none">
                Registrar Asistencia Manual
              </Nav.Link>
              <Nav.Link as={Link} to="/asistencias/visualizar" className="text-white text-decoration-none">
                Visualizar Asistencias
              </Nav.Link>
              <Nav.Link as={Link} to="/alumnos/crear" className="text-white text-decoration-none">
                Registrar Alumno
              </Nav.Link>
              <Nav.Link as={Link} to="/alumnos/tabla" className="text-white text-decoration-none">
                Visualizar Alumnos
              </Nav.Link>
              <Nav.Link as={Link} to="/usuarios/crear" className="text-white text-decoration-none">
                Registrar Usuario
              </Nav.Link>
              <Nav.Link as={Link} to="/usuarios/tabla" className="text-white text-decoration-none">
                Visualizar Usuarios
              </Nav.Link>
              <Nav.Link as={Link} to="/alertas" className="text-white text-decoration-none">
                Exportar Alertas
              </Nav.Link>
              <Nav.Link as={Link} to="/parametros" className="text-white text-decoration-none">
                Fechas Inhábiles
              </Nav.Link>
            </Nav>
            <Button variant="outline-danger" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet />
        
      </Container>
    </>
  );
}
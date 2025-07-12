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
              <Nav.Link as={Link} to="/dashboard">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/Consultor">
                Consultor
              </Nav.Link>
              <Nav.Link as={Link} to="/Iniciousuario">
                Administrador
              </Nav.Link>
              <Nav.Link as={Link} to="/Rector">
                Rector
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
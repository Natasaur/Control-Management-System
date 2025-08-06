import React from 'react';
import { Container, Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Logo from '../../img/utc.png'

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
          <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center gap-2">
            <img
              src={Logo}
              alt="Logo"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            Control Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">

              {/* Asistencias */}
              <NavDropdown title="Asistencias" id="asistencias-dropdown" className="text-white text-decoration-none">
                <NavDropdown.Item as={Link} to="/asistencias/manual">
                  Registrar Asistencia Justificada
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/asistencias/visualizar">
                  Visualizar Asistencias
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/asistencias/eliminar">
                  Eliminar Asistencia
                </NavDropdown.Item>
              </NavDropdown>

              {/* Alumnos */}
              <NavDropdown title="Alumnos" id="asistencias-dropdown" className="text-white text-decoration-none">
                <NavDropdown.Item as={Link} to="/alumnos/crear">
                  Registrar Único Alumno
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/alumnos/tabla">
                  Cargar Lista de Alumnos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/alumnos/visualizar">
                  Visualizar Alumnos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/alumnos/asignarEncoding">
                  Asignar Foto
                </NavDropdown.Item>
              </NavDropdown>

              {/* Usuarios */}
              <NavDropdown title="Usuarios" id="asistencias-dropdown" className="text-white text-decoration-none">
                <NavDropdown.Item as={Link} to="/usuarios/crear">
                  Registrar Único Usuario
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/usuarios/tabla">
                  Cargar Lista de Usuarios
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/usuarios/visualizar">
                  Visualizar Usuarios
                </NavDropdown.Item>
              </NavDropdown>

              {/* Utilidades */}
              <NavDropdown title="Utilidades" id="asistencias-dropdown" className="text-white text-decoration-none">
                <NavDropdown.Item as={Link} to="/alertas">
                  Exportar Alertas
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/parametros">
                  Registrar Fecha Inhábil
                </NavDropdown.Item>
              </NavDropdown>

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
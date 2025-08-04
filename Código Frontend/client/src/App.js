import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './Components/layout/MainLayout';
import Dashboard from './Components/dashboard';
import Login from './Components/Sesion/login/Login';
import Password from './Components/Sesion/password/Password';

import CrearUnicoAlumno from "./Components/AlumnosYGrupos/CrearUnicoAlumno";
import { TablaAlumnos } from "./Components/AlumnosYGrupos/TablaAlumnos";
import { TablaVA } from './Components/AlumnosYGrupos/TablaVA'
import AsistenciaManual from "./Components/Asistencias/AsistenciaManual";
//import VisualizarA from "./Components/Asistencias/VisualizarA";
import TablaVAsistencias from "./Components/Asistencias/TablaVAsistencias";
import CrearUnicoU from "./Components/Usuarios/CrearUnicoU";
import Tabla from "./Components/Usuarios/Tabla";
import TablaV from "./Components/Usuarios/TablaV";
import Alertas from "./Components/Alertas/Alertas";
import Parametros from "./Components/Parametros/Parametros";
import EliminarA from "./Components/Asistencias/eliminarA";


import Cookies from 'js-cookie';


const NotFound = () => {
  return (
    <div className="error-404">
      <h1>404 - Página no encontrada</h1>
    </div>
  );
};

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const token = Cookies.get('token');
  return token ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [setToken] = useState(Cookies.get("token"));

  //const [userRole, setUserRole] = useState(null);
  //const [token, setToken] = useState(Cookies.get('token'));
  //const [rol, setRol] = useState(Cookies.get('rol'));
  //const navigate = useNavigate();

  /*const checkAuthentication = () => {
    const existingToken = Cookies.get('token');
    const existingRol = Cookies.get('rol');

    if (existingToken && existingRol) {
      setIsAuthenticated(true);
      setUserRole(existingRol);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }

    setIsLoading(false);
  };*/

  const checkAuthentication = () => {
    const existingToken = Cookies.get('token');
    setIsAuthenticated(!!existingToken);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  /*
  const navigateToRolePage = (userRole) => {
    navigate('/dashboard');
    switch (userRole) {
      case 'A':
        navigate('/Iniciousuario');
        break;
      case 'AP':
        navigate('/Inicio-usuario');
        break;
      case 'C':
        navigate('/Consultor');
        break;
      case 'U':
        navigate('/Rector');
        break;
      default:
        navigate('/404', { replace: true });
    }
  };
  */

  if (isLoading) {
    return <div>Loading...</div>;
  }

  /*useEffect(() => {
    // Realizar redirección cuando las cookies se actualicen
    if (isAuthenticated && userRole) {
      navigateToRolePage(userRole);
    }
  }, [isAuthenticated, userRole]);

  const requireRole = (component, allowedRoles) => {
    return isAuthenticated && allowedRoles.includes(userRole) ? component : <Navigate to="/404" replace />;
  };*/

  

  /**
    <Route path="/Iniciousuario" element={requireRole(<InicioA />, ['A'])} />
    <Route path="/Inicio-usuario" element={requireRole(<Inicio />, ['AP'])} />
    <Route path="/Parametros" element={requireRole(<ParametroA />, ['A'])} />
    <Route path="/Parametro" element={requireRole(<Parametro />, ['AP'])} />
    <Route path="/Rector" element={requireRole(<Rector />, ['U'])} />
    <Route path="/Consultor" element={requireRole(<Consultor />, ['C'])} />
    <Route path="/seleccionar" element={requireRole(<Selecionar />, ['C'])} />
    <Route path="/cambioA" element={requireRole(<CambioA />, ['A'])} />
    <Route path="/cambioB" element={<CambioB />} />
    <Route path="/dashboard" element={<Dashboard />} /> 
  */

  /*return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} setRol={setRol} />} />
        <Route path="/password" element={<Password />} />
        <Route path="/404" element={<NotFound />} />
        {!isLoading && isAuthenticated && (
          <>
          
            <Route path="/Iniciousuario" element={<InicioA />} />
            <Route path="/Inicio-usuario" element={requireRole(<Inicio />, ['A'])} />
            <Route path="/Parametros" element={requireRole(<ParametroA />, ['A'])} />
            <Route path="/Parametro" element={requireRole(<Parametro />, ['A'])} />
            <Route path="/Rector" element={requireRole(<Rector />, ['A'])} />
            <Route path="/Consultor" element={requireRole(<Consultor />, ['A'])} />
            <Route path="/seleccionar" element={requireRole(<Selecionar />, ['A'])} />
            <Route path="/cambioA" element={requireRole(<CambioA />, ['A'])} />
            <Route path="/cambioB" element={<CambioB />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
          </>
        )}
        {!isLoading && !isAuthenticated && (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};*/

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login setToken={setToken} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/password" element={<Password />} />
        <Route path="/404" element={<NotFound />} />

        {/* Rutas privadas */}
        {isAuthenticated && (
          <Route element={<PrivateRoute><MainLayout setIsAuthenticated={setIsAuthenticated} /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Asistencias */}
            <Route path="/asistencias/manual" element={<AsistenciaManual />} />
            <Route path="/asistencias/visualizar" element={<TablaVAsistencias />} />
            <Route path="/asistencias/eliminar" element={<EliminarA />} />

            {/* Alumnos y grupos */}
            <Route path="/alumnos/crear" element={<CrearUnicoAlumno />} />
            <Route path="/alumnos/tabla" element={<TablaAlumnos />} />
            <Route path="/alumnos/visualizar" element={<TablaVA />} />

            {/* Usuarios */}
            <Route path="/usuarios/crear" element={<CrearUnicoU />} />
            <Route path="/usuarios/tabla" element={<Tabla />} />
            <Route path="/usuarios/visualizar" element={<TablaV />} />

            {/* Alertas */}
            <Route path="/alertas" element={<Alertas />} />

            {/* Parámetros */}
            <Route path="/parametros" element={<Parametros />} />
          </Route>
        )}

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

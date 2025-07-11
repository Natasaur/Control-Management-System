import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Components/layout/MainLayout';
import Dashboard from './Components/dashboard';
import Consultor from './Components/Consultor/Consultor';
import Iniciousuario from './Components/Administrador/inicio/InicioA';
import Rector from './Components/Rector/ComponentesRector/Rector';
import Login from './Components/Sesion/login/Login';
import Inicio from './Components/Administrador/inicio/Inicio';
//import InicioA from './Components/Administrador/inicio/InicioA';
import Parametro from './Components/Administrador/parametros/Parametros';
import ParametroA from './Components/Administrador/parametros/ParametrosA';
import Selecionar from './Components/Consultor/Selecccionar';
import Password from './Components/Sesion/password/Password';
import CambioA from './Components/Todos/RestablecerDatosA';
import CambioB from './Components/Todos/RestablecerDatos';
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

  /*const navigateToRolePage = (userRole) => {
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
  };*/

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
      {/** PUBLIC ROUTES */}
        <Route path="/" element={<Login setToken={ setToken } />} />
        <Route path="/password" element={<Password />} />
        <Route path="/404" element={<NotFound />} />

        {/** PRIVATE ROUTES IN LAYOUT */}
        {isAuthenticated && (
          <Route element={ <PrivateRoute> <MainLayout /> </PrivateRoute> }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Iniciousuario" element={<Iniciousuario />} />
            <Route path="/Inicio-usuario" element={<Inicio />} />
            <Route path="/Parametros" element={<ParametroA />} />
            <Route path="/Parametro" element={<Parametro />} />
            <Route path="/Rector" element={<Rector />} />
            <Route path="/Consultor" element={<Consultor />} />
            <Route path="/seleccionar" element={<Selecionar />} />
            <Route path="/cambioA" element={<CambioA />} />
            <Route path="/cambioB" element={<CambioB />} />
          </Route>
        )}

        {/** CATCH ALL */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

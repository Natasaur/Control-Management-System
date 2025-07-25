import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MargenConsultor from '../Extras/MargenConsultor';
import Cookies from 'js-cookie';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import './style.css';
import { ENV } from '../../utils/Constants';

export default function GroupsList() {
  const BASE_PATH = ENV.BASE_PATH;
  const RouteGBA = ENV.API_ROUTES.qQANNmoaeTiGByckDsi5mGIqqHU33gGA;
  const RouteUA = ENV.API_ROUTES.N1Pd4tsPNNhd0duhg2MBNDBbER22oJHQAG;
  const [grupo, setGrupo] = useState([]);
  const [seleccionarGrupo, setSeleccionarGrupo] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [errorOcurrio, setErrorOcurrio] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const token = Cookies.get('token');
  const plantel = Cookies.get('plantel');
  const matricula = Cookies.get('matricula');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlGBA = `${BASE_PATH}${RouteGBA}`;
        const data = {
          plantel: plantel,
        };
        const response = await axios.post(urlGBA, data, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const grupos = response.data;
        if (grupos.length === 0) {
          setErrorMensaje('No se encontraron grupos disponibles de acuerdo a la zona');
          setErrorOcurrio(true);
        } else {
          setErrorMensaje('');
          setErrorOcurrio(false);
        }
        setGrupo(grupos);
      } catch (error) {
        setErrorMensaje('No se encontraron grupos disponibles de acuerdo a la zona');
        console.error(error);
      }
    };

    fetchData();
  }, [plantel, token]);

  const handleClickGrupo = (group) => {
    if (group.disponible) {
      if (seleccionarGrupo.includes(group)) {
        setSeleccionarGrupo(seleccionarGrupo.filter((selectedGroup) => selectedGroup !== group));
      } else {
        setSeleccionarGrupo([...seleccionarGrupo, group]);
      }
    }
  };

  const guardarSeleccion = async () => {
    if (seleccionarGrupo.length > 0) {
      const grupoActualizado = {
        grupo: seleccionarGrupo[0].grupo,
      };
      const urlUA = `${BASE_PATH}${RouteUA}`;
      const data = {
        matricula: matricula,
        ...grupoActualizado,
      };

      try {
        await axios.patch(urlUA, data, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        setGuardadoExitoso(true);
      } catch (error) {
        setErrorMensaje('Ocurrió un error al guardar el grupo');
        console.error(error);
      }
    } else {
      setErrorMensaje('No se ha seleccionado ningún grupo');
    }
  };

  return (
    <>
      <MargenConsultor />
      <div>
        <h2 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Seleccionar grupos</h2>
      </div>
      <div className='container mt-4'>
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-center align-items-center">
              <Card.Title>Seleccionar los grupos disponibles</Card.Title>
            </div>
          </Card.Header>
          <Card.Body className="mb-4">
            {errorMensaje && <Alert variant="danger">{errorMensaje}</Alert>}
            {guardadoExitoso && <Alert variant="success">Grupo guardado exitosamente</Alert>}
            <ul className="list-group">
              {grupo.map((group) => (
                <li
                  key={group.grupo}
                  className={`group-item list-group-item ${seleccionarGrupo.includes(group) ? 'selected' : ''} ${!group.disponible ? 'disabled' : ''}`}
                  onClick={() => handleClickGrupo(group)}
                >
                  {group.grupo}
                </li>
              ))}
            </ul>

          </Card.Body>
          <Card.Footer>
            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-primary" onClick={guardarSeleccion}>Guardar</button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}

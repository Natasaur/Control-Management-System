import React, { useState, useEffect } from 'react';
import './CSS/calendario.css';
import { Button, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../../utils/Constants';

export default function Calendario() {
    const BASE_PATH = ENV.BASE_PATH;
    const RouteFE = ENV.API_ROUTES.idfg8SRgSCyRAAYLi5aFtzhLw0Tl1hQEF;
    const RouteFC = ENV.API_ROUTES.cRaXoJXJBEMdhYvVCe75aWMeza5TcbwCF;
    const RouteFB = ENV.API_ROUTES.QqKu8VqZBGbet6PBK5xv4DPosMAskKyEOF;
    const [modalidad, setModalidad] = useState('');
    const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
    const [fechasExistentes, setFechasExistentes] = useState([]);
    const [alerta, setAlerta] = useState(null);
    const token = Cookies.get('token');

    const handleCambio = (event) => {
        const selectedModalidad = event.target.value;
        setModalidad(selectedModalidad);
    };

    const modalidades = {
        10: 'Escolarizado',
        20: 'Nocturno',
        30: 'Ejecutivo',
    };

    const [fechaActual, setFechaActual] = useState(new Date());
    const diasDeLaSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

    const diasEnMes = () => {
        const year = fechaActual.getFullYear();
        const month = fechaActual.getMonth() + 1;
        return new Date(year, month, 0).getDate();
    };

    const primerDiaDelMes = () => {
        const year = fechaActual.getFullYear();
        const month = fechaActual.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const manejarMesAnterior = () => {
        setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1));
    };

    const manejarMesSiguiente = () => {
        setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1));
    };

    const manejarClickDia = (dia) => {
        const year = fechaActual.getFullYear();
        const month = fechaActual.getMonth();
        const date = new Date(year, month, dia);
    
        if (!modalidad) {
            mostrarAlerta('Selecciona una modalidad antes de seleccionar fechas.', 'danger');
            return;
        }
    
        const esMesDiferente = fechaActual.getMonth() !== date.getMonth();
    
        if (esMesDiferente) {
            return;
        }
    
        const fechaSeleccionada = {
            fecha: formatoFecha(date),
            semana: obtenerNumeroSemana(date),
            modalidad: modalidades[modalidad],
        };
    
        const fechaExistenteModalidad = fechasExistentes.find(
            (fecha) => fecha.fecha === fechaSeleccionada.fecha && fecha.modalidad === fechaSeleccionada.modalidad
        );
    
        const fechaSeleccionadaModalidad = fechasSeleccionadas.find(
            (fecha) => fecha.fecha === fechaSeleccionada.fecha && fecha.modalidad === fechaSeleccionada.modalidad
        );
    
        if (fechaExistenteModalidad) {
            alert('Esta fecha ya está seleccionada en la modalidad actual.');
            return;
        }
    
        if (fechaSeleccionadaModalidad) {
            alert('Esta fecha ya está seleccionada en la lista actual de fechas.');
            return;
        }
    
        setFechasSeleccionadas([...fechasSeleccionadas, fechaSeleccionada]);
    };
    

    const guardarFechas = async () => {
        if (fechasSeleccionadas.length === 0) {
            mostrarAlerta('No hay fechas seleccionadas para guardar.', 'danger');
            return;
        }

        try {
            const fechasModalidadSeleccionada = fechasExistentes.filter(
                (fecha) => fecha.modalidad === modalidades[modalidad]
            );

            if (fechasModalidadSeleccionada.length > 0) {
                // Eliminar las fechas existentes de la modalidad seleccionada antes de guardar las nuevas fechas
                const urlFE = `${BASE_PATH}${RouteFE}`;
                await axios.delete(urlFE, {
                    data: fechasModalidadSeleccionada,
                    headers: {
                        Authorization: `${token}`,
                    },
                });
            }

            // Guardar las nuevas fechas seleccionadas
            const urlFC = `${BASE_PATH}${RouteFC}`;
            await axios.post(urlFC, fechasSeleccionadas, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            mostrarAlerta('Fechas guardadas exitosamente', 'success');
            console.log(fechasSeleccionadas);
            getFechasExistentes(); // Actualizar fechas existentes después de guardar
            setFechasSeleccionadas([]); // Limpiar las fechas seleccionadas después de guardar
        } catch (error) {
            console.log(error);
            mostrarAlerta('Error al guardar las fechas', 'danger');
        }
    };

    const getFechasExistentes = async () => {
        try {
            const urlFB = `${BASE_PATH}${RouteFB}`;
            const response = await axios.get(urlFB, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setFechasExistentes(response.data);
        } catch (error) {
            console.log(error);
            alert('Error al obtener las fechas existentes');
        }
    };

    useEffect(() => {
        if (token) {
            getFechasExistentes();
        }
    }, []);

    const renderizarDias = () => {
        const dias = [];
        const cantidadDias = diasEnMes();
        const primerDia = primerDiaDelMes();

        for (let i = 0; i < primerDia; i++) {
            dias.push(<div className="empty-day" key={`empty${i}`} />);
        }

        for (let i = 1; i <= cantidadDias; i++) {
            const date = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i);
            const esMesDiferente = fechaActual.getMonth() !== date.getMonth();
            const fechaSeleccionada = fechasSeleccionadas.find(
                (fecha) => fecha.fecha === formatoFecha(date) && fecha.modalidad === modalidades[modalidad]
            );
            const fechaExistente = fechasExistentes.find(
                (fecha) => fecha.fecha === formatoFecha(date) && fecha.modalidad === modalidades[modalidad]
            );

            dias.push(
                <div
                    className={`day ${esMesDiferente ? 'different-month' : ''} ${fechaSeleccionada ? 'selected' : ''
                        } ${fechaExistente ? 'existing' : ''}`}
                    key={`day${i}`}
                    onClick={() => manejarClickDia(i)}
                >
                    {i}
                </div>
            );
        }

        return dias;
    };

    const formatoFecha = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, 0);
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    const obtenerNumeroSemana = (date) => {
        const primerDiaDelMes = new Date(date.getFullYear(), date.getMonth(), 1);
        const diasDesdePrimerDiaDelMes = (date - primerDiaDelMes) / (1000 * 60 * 60 * 24);
        return Math.ceil((diasDesdePrimerDiaDelMes + primerDiaDelMes.getDay() + 1) / 7);
    };

    const mostrarAlerta = (mensaje, tipo) => {
        setAlerta({ mensaje, tipo });
        setTimeout(() => {
            setAlerta(null);
        }, 3000);
    };

    return (
        <Card>
            
            <div className="calendario">
                <div className="header">
                    <Button onClick={manejarMesAnterior}>&lt;</Button>
                    <h1>{fechaActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h1>
                    <Button onClick={manejarMesSiguiente}>&gt;</Button>
                </div>
                <div className="modalidad">
                    <select value={modalidad} onChange={handleCambio}>
                        <option value="">Selecciona una modalidad</option>
                        <option value="10">Escolarizado</option>
                        <option value="20">Nocturno</option>
                        <option value="30">Ejecutivo</option>
                    </select>
                </div>
                <div className="dias-semana">
                    {diasDeLaSemana.map((dia) => (
                        <div key={dia}>{dia}</div>
                    ))}
                </div>
                <div className="dias mb-4">{renderizarDias()}</div>
                <Button className="guardarF" onClick={guardarFechas}>
                    Guardar Fechas
                </Button>
                {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}
            </div>
        </Card>
    );
}

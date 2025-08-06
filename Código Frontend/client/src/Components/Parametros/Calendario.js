import React, { useState, useEffect } from 'react';
import './CSS/calendario.css';
import { Button, Alert, Card, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ENV } from '../../utils/Constants';

export default function Calendario() {
    const BASE_PATH = ENV.BASE_PATH;
    //const RouteFE = ENV.API_ROUTES.idfg8SRgSCyRAAYLi5aFtzhLw0Tl1hQEF;
    //const RouteFC = ENV.API_ROUTES.cRaXoJXJBEMdhYvVCe75aWMeza5TcbwCF;
    //const RouteFB = ENV.API_ROUTES.QqKu8VqZBGbet6PBK5xv4DPosMAskKyEOF;

    const [modalidad, setModalidad] = useState('');
    const [motivo, setMotivo] = useState('');
    const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
    const [fechasExistentes, setFechasExistentes] = useState([]);
    const [fechasNoLaborables, setFechasNoLaborables] = useState([]);
    const [alerta, setAlerta] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);


    const token = Cookies.get('token');

    const obtenerDiasNoLaborables = async () => {
        try {
            const url = `${BASE_PATH}/diasnolaborables/obtenerDias`;
            const response = await axios.get(url, {
                headers: { Authorization: `${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener los días no laborables', error);
            return [];
        }
    };

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
        setDiaSeleccionado(date);
        setMostrarModal(true);
    };

    const confirmarSeleccion = () => {
        const date = diaSeleccionado;
        const fechaStr = formatoFecha(date);

        if (!modalidad) {
            mostrarAlerta('Selecciona una modalidad.', 'danger');
            return;
        }

        if (fechasNoLaborables.includes(fechaStr)) {
            mostrarAlerta('Esta fecha ya está registrada.', 'danger');
            return;
        }

        const fechaSeleccionada = {
            fecha: fechaStr,
            semana: obtenerNumeroSemana(date),
            modalidad: modalidades[modalidad],
            motivo: motivo || 'Sin especificar',
        };

        const yaExiste = fechasExistentes.find(
            (f) => f.fecha === fechaStr && f.modalidad === modalidades[modalidad]
        ) || fechasSeleccionadas.find(
            (f) => f.fecha === fechaStr && f.modalidad === modalidades[modalidad]
        );

        if (yaExiste) {
            mostrarAlerta('Esta fecha ya fue seleccionada.', 'warning');
            return;
        }

        setFechasSeleccionadas([...fechasSeleccionadas, fechaSeleccionada]);
        setMostrarModal(false);
    };


    const guardarFechas = async () => {
        if (fechasSeleccionadas.length === 0) {
            mostrarAlerta("No hay fechas seleccionadas para guardar.", "danger");
            return;
        }

        const url = `${BASE_PATH}/diasnolaborables/crearDia`;

        try {
            for (const fecha of fechasSeleccionadas) {
                const body = {
                    fecha: fecha.fecha,
                    modalidad: fecha.modalidad,
                    motivo: fecha.motivo,
                };

                await axios.post(url, body, {
                    headers: { Authorization: `${token}` },
                });
            }

            mostrarAlerta("Fechas no laborables guardadas correctamente.", "success");
            setFechasSeleccionadas([]);
            setMotivo("");
            getFechasExistentes(); // Recarga los días del mes
        } catch (error) {
            console.error("Error al guardar las fechas:", error);
            mostrarAlerta(
                error?.response?.data?.message || "Error al guardar las fechas.",
                "danger"
            );
        }
    };

    const getFechasExistentes = async () => {
        const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        const finMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

        const url = `${BASE_PATH}/diasnolaborables/obtenerDias`;

        try {
            const response = await axios.post(
                url,
                {
                    fechaInicio: inicioMes,
                    fechaFin: finMes,
                },
                {
                    headers: { Authorization: `${token}` },
                }
            );

            const fechas = response.data.map((f) => ({
                fecha: formatoFecha(new Date(f.fecha)),
                modalidad: f.modalidad,
                motivo: f.motivo,
            }));

            setFechasExistentes(fechas);
        } catch (error) {
            console.error("Error al cargar fechas:", error);
            mostrarAlerta("Error al cargar fechas del calendario", "danger");
        }
    };

    useEffect(() => {
        if (token) {
            getFechasExistentes();
            obtenerDiasNoLaborables().then(dias => {
                const fechas = dias.map(d => d.fecha);
                setFechasNoLaborables(fechas);
            });
        }
    }, [token]);

    const renderizarDias = () => {
        const dias = [];
        const cantidadDias = diasEnMes();
        const primerDia = primerDiaDelMes();

        for (let i = 0; i < primerDia; i++) {
            dias.push(<div className="empty-day" key={`empty${i}`} />);
        }

        for (let i = 1; i <= cantidadDias; i++) {
            const date = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i);
            const fechaStr = formatoFecha(date);
            const seleccionada = fechasSeleccionadas.some(f => f.fecha === fechaStr && f.modalidad === modalidades[modalidad]);
            const existente = fechasExistentes.some(f => f.fecha === fechaStr && f.modalidad === modalidades[modalidad]);
            const noLaborable = fechasNoLaborables.includes(fechaStr);

            dias.push(
                <div
                    className={`day ${seleccionada ? 'selected' : ''} ${existente ? 'existing' : ''} ${noLaborable ? 'nolaborable' : ''}`}
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
        const month = String(date.getMonth() + 1).padStart(2, '0');
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
        <div className='contenedor-calendario'>
            <Card>
                <div className="calendario">
                    <div className="header">
                        <Button onClick={manejarMesAnterior}>&lt;</Button>
                        <h1>{fechaActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h1>
                        <Button onClick={manejarMesSiguiente}>&gt;</Button>
                    </div>

                    <div className="modalidad mb-2">
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

                    {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}
                </div>

                {/* 👇 Aquí va el Modal dentro del return */}
                <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrar día no laborable</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            <label>Modalidad</label>
                            <select className="form-control" value={modalidad} onChange={handleCambio}>
                                <option value="">Selecciona una modalidad</option>
                                <option value="10">Escolarizado</option>
                                <option value="20">Nocturno</option>
                                <option value="30">Ejecutivo</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label>Motivo</label>
                            <input
                                type="text"
                                className="form-control"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Ej. Evento especial, suspensión, etc."
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={confirmarSeleccion}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import './CSS/calendario.css';

Modal.setAppElement("#root");

const modalidades = {
    0: "Escolarizado",
    1: "Mixto",
    2: "Virtual",
};

const fechaToISO = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

const Calendario = () => {
    const [fechaActual, setFechaActual] = useState(new Date());
    const [fechasSeleccionadas, setFechasSeleccionadas] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalidad, setModalidad] = useState(0);
    const [motivo, setMotivo] = useState("");
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [fechasNoLaborables, setFechasNoLaborables] = useState([]);
    const [fechasExistentes, setFechasExistentes] = useState([]);

    useEffect(() => {
        obtenerDiasNoLaborables();
        getFechasExistentes();
    }, []);

    const obtenerDiasNoLaborables = async () => {
        try {
            const response = await axios.get("http://localhost:3997/API/v1/diasnolaborables/obtenerDias");
            const fechas = response.data.map(d => fechaToISO(new Date(d.fecha)));
            setFechasNoLaborables(fechas);
        } catch (error) {
            console.error("Error al obtener los días no laborables:", error);
        }
    };

    const getFechasExistentes = async () => {
        try {
            const response = await axios.get("http://localhost:3997/API/v1/diasnolaborables/obtenerDias");
            const fechas = response.data.map(d => ({
                fecha: fechaToISO(new Date(d.fecha)),
                modalidad: d.modalidad,
                motivo: d.motivo,
            }));
            setFechasExistentes(fechas);
        } catch (error) {
            console.error("Error al obtener las fechas existentes:", error);
        }
    };

    const abrirModal = (dia) => {
        setDiaSeleccionado(dia);
        setModalIsOpen(true);
    };

    const cerrarModal = () => {
        setModalIsOpen(false);
        setMotivo("");
        setModalidad(0);
    };

    const confirmarSeleccion = () => {
        if (!motivo) return alert("Por favor, ingresa un motivo.");
        const date = new Date(diaSeleccionado);
        const fechaStr = fechaToISO(date);

        setFechasSeleccionadas([
            ...fechasSeleccionadas,
            {
                fecha: fechaStr,
                modalidad: modalidades[modalidad],
                motivo,
            },
        ]);

        cerrarModal();
    };

    const cambiarMes = (mes) => {
        const nuevoMes = new Date(fechaActual.setMonth(fechaActual.getMonth() + mes));
        setFechaActual(new Date(nuevoMes));
    };

    const guardarFechas = async () => {
        try {
            for (const fecha of fechasSeleccionadas) {
                const body = {
                    fecha: fechaToISO(new Date(fecha.fecha)),
                    modalidad: fecha.modalidad,
                    motivo: fecha.motivo,
                };
                await axios.post("http://localhost:3997/API/v1/diasnolaborables/crearDia", body);
            }
            alert("Fechas guardadas correctamente.");
            setFechasSeleccionadas([]);
            obtenerDiasNoLaborables();
            getFechasExistentes();
        } catch (error) {
            console.error("Error al guardar fechas:", error);
        }
    };

    const renderizarDias = () => {
        const dias = [];
        const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
        const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();

        for (let i = 0; i < primerDiaMes; i++) {
            dias.push(<div key={`empty-${i}`} className="p-2" />);
        }

        for (let i = 1; i <= ultimoDiaMes; i++) {
            const date = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i);
            const isoDate = fechaToISO(date);

            const seleccionada = fechasSeleccionadas.some(f => f.fecha === isoDate && f.modalidad === modalidades[modalidad]);
            const existente = fechasExistentes.some(f => f.fecha === isoDate && f.modalidad === modalidades[modalidad]);
            const noLaborable = fechasNoLaborables.includes(isoDate);

            let color = "bg-white";
            if (noLaborable || existente) color = "bg-orange-300";
            if (seleccionada) color = "bg-blue-300";

            dias.push(
                <div
                    key={i}
                    className={`p-2 border text-center cursor-pointer ${color} rounded-lg hover:bg-blue-100`}
                    onClick={() => abrirModal(date)}
                >
                    {i}
                </div>
            );
        }

        return dias;
    };

    return (
        <div className="p-4 w-full min-h-screen bg-gray-100">

            <h1 className="text-3xl font-bold mb-6 text-center">Calendario de días no laborables</h1>

            <div className="flex justify-between mb-4 row">
                <div className="col">
                    <button
                        onClick={() => cambiarMes(-1)}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    >
                        Mes anterior
                    </button>
                </div>
                <div className="col">
                    <h2 className="text-xl font-semibold">
                        {fechaActual.toLocaleString("default", { month: "long" })} {fechaActual.getFullYear()}
                    </h2>

                </div>
                <div className="col">
                    <button
                        onClick={() => cambiarMes(1)}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    >
                        Mes siguiente
                    </button>
                </div>
            </div>
            <div className="dias-semana">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((dia, idx) => (
                    <div key={idx} className="dia-semana">{dia}</div>
                ))}
            </div>

            <div className="dias-grid">{renderizarDias()}</div>


            <div className="mt-6 text-center">
                <button
                    onClick={guardarFechas}
                    className="px-4 py-2 rounded hover:bg-green-600"
                >
                    Guardar días no laborables
                </button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={cerrarModal}
                className="ReactModal__Content"
                overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center pt-10 z-50"
            >
                <h2>Agregar día no laborable</h2>

                <select
                    value={modalidad}
                    onChange={(e) => setModalidad(Number(e.target.value))}
                    aria-label="Modalidad"
                >
                    {Object.entries(modalidades).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Motivo"
                    aria-label="Motivo"
                />

                <div className="modal-buttons">
                    <button onClick={cerrarModal} className="modal-btn-cancel">
                        Cancelar
                    </button>
                    <button onClick={confirmarSeleccion} className="modal-btn-confirm">
                        Confirmar
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Calendario;
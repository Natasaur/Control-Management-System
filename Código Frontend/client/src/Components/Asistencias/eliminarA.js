import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button, Form, Table } from "react-bootstrap";
import Cookies from "js-cookie";
import { ENV } from '../../utils/Constants';
import { FaFilter } from "react-icons/fa";

export default function EliminarAsistencia() {
   const BASE_PATH = ENV.BASE_PATH;
   const [matricula, setMatricula] = useState("");
   const [fecha, setFecha] = useState(null);
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [mensaje, setMensaje] = useState("");
   const [asistenciasJustificadas, setAsistenciasJustificadas] = useState([]);
   const token = Cookies.get("token");
   const [filtroMatricula, setFiltroMatricula] = useState("");
   const [filtroFecha, setFiltroFecha] = useState("");
   const [filtroGrupo, setFiltroGrupo] = useState("");

   const asistenciasFiltradas = asistenciasJustificadas.filter((a) => {
      const coincideMatricula = a.matricula.includes(filtroMatricula);
      const coincideFecha = a.fecha
         ? new Date(a.fecha).toLocaleDateString().includes(filtroFecha)
         : false;
      const coincideGrupo = a.grupo.toLowerCase().includes(filtroGrupo.toLowerCase());
      return coincideMatricula && coincideFecha && coincideGrupo;
   });

   useEffect(() => {
      const fetchJustificadas = async () => {
         try {
            const res = await axios.get(`${BASE_PATH}/asistencia/obtenerJustificadas`, {
               headers: { Authorization: token },
            });
            setAsistenciasJustificadas(res.data);
         } catch (error) {
            console.error("Error al cargar asistencias justificadas", error);
         }
      };
      if (token) fetchJustificadas();
   }, [token, BASE_PATH]);

   const handleEliminar = async () => {
      try {
         const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/asistencia/eliminar`, {
            headers: {
               Authorization: token,
               "Content-Type": "application/json",
            },
            data: {
               matricula,
               fecha: fecha.toISOString(),
            },
         });

         setMensaje(response.data.msg);
         // Actualizar lista luego de eliminar
         setAsistenciasJustificadas((prev) =>
            prev.filter((a) => !(a.matricula === matricula && new Date(a.fecha).toISOString() === fecha.toISOString()))
         );
         setMatricula("");
         setFecha(null);
      } catch (error) {
         console.error(error);
         setMensaje(error.response?.data?.msg || "Error al eliminar asistencia");
      } finally {
         setShowConfirmModal(false);
      }
   };

   const handleConfirmar = () => {
      if (!matricula || !fecha) {
         setMensaje("Debes ingresar matrícula y seleccionar fecha.");
         return;
      }
      setShowConfirmModal(true);
   };

   const handleFilaClick = (a) => {
      setMatricula(a.matricula);
      setFecha(new Date(a.fecha));
   };

   return (
      <div className="container mt-4">
         <div>
            <h3 className="text-center mb-4" style={{ backgroundColor: '#FD7E14', color: 'white', padding: '10px' }}>Eliminar asistencia justificada</h3>
         </div>

         <Form>
            <Form.Group controlId="matricula">
               <Form.Label>Matrícula</Form.Label>
               <Form.Control
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="Escribe la matrícula"
               />
            </Form.Group>

            <Form.Group controlId="fecha" className="mt-3">
               <Form.Label>Fecha</Form.Label>
               <DatePicker
                  selected={fecha}
                  onChange={(date) => setFecha(date)}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona la fecha"
               />
            </Form.Group>

            <Button className="mt-4" variant="danger" onClick={handleConfirmar}>
               Eliminar asistencia
            </Button>
         </Form>

         {mensaje && <p className="mt-3">{mensaje}</p>}

         <h4 className="mt-5">Asistencias Justificadas Registradas</h4>
         <Table striped bordered hover responsive >
            <thead>
               <tr>
                  <th>
                     Fecha <FaFilter />
                     <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Filtrar fecha"
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="mt-1"
                     />
                  </th>
                  <th>
                     Matrícula <FaFilter />
                     <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Filtrar matrícula"
                        onChange={(e) => setFiltroMatricula(e.target.value)}
                        className="mt-1"
                     />
                  </th>
                  <th>
                     Grupo <FaFilter />
                     <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Filtrar grupo"
                        onChange={(e) => setFiltroGrupo(e.target.value)}
                        className="mt-1"
                     />
                  </th>
                  <th>Ciclo escolar</th>
               </tr>
            </thead>

            <tbody>
               {asistenciasFiltradas.map((a) => (
                  <tr
                     key={`${a.matricula}-${a.fecha}`}
                     onClick={() => handleFilaClick(a)}
                     style={{ cursor: "pointer" }}
                     title="Haz clic para seleccionar esta asistencia"
                  >
                     <td>{new Date(a.fecha).toLocaleDateString()}</td>
                     <td>{a.matricula}</td>
                     <td>{a.grupo}</td>
                     <td>{a.ciclo_escolar}</td>
                  </tr>
               ))}
            </tbody>


         </Table>

         <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Estás seguro de que deseas eliminar esta asistencia?</Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                  Cancelar
               </Button>
               <Button variant="danger" onClick={handleEliminar}>
                  Eliminar
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENV } from '../../utils/Constants';
//import Alumno = require('../../../../../Código Backend/server/models/alumnos');

export default function AsignarEncoding() {
   const BASE_PATH = ENV.BASE_PATH;
   const [busqueda, setBusqueda] = useState('');
   const [resultados, setResultados] = useState([]);
   const [mensaje, setMensaje] = useState('');

   // Esta función hace la búsqueda en el backend
   const buscarAlumnos = async (valor = '') => {
      try {
         const url = valor.trim()
            ? `${BASE_PATH}/alumno/sinEncoding?query=${encodeURIComponent(valor)}`
            : `${BASE_PATH}/alumno/sinEncoding`;

         const res = await axios.get(url);
         setResultados(res.data);
         if (res.data.length === 0) setMensaje('No se encontraron alumnos sin encoding.');
         else setMensaje('');
      } catch (error) {
         console.error(error);
         setMensaje('Error al buscar alumnos.');
      }
   };

   // Llamar automáticamente al cargar el componente
   useEffect(() => {
      buscarAlumnos();
   }, []);

   // Búsqueda en tiempo real con "debounce"
   useEffect(() => {
      const delayDebounce = setTimeout(() => {
         buscarAlumnos(busqueda);
      }, 400); // Espera 400ms después de que el usuario deja de escribir

      return () => clearTimeout(delayDebounce);
   }, [busqueda]);

   const manejarCambioArchivo = async (e, alumno) => {
      const archivo = e.target.files[0];
      if (!archivo) return;

      const formData = new FormData();
      formData.append('imagen', archivo);

      try {
         // 1. Enviar imagen a backend Django para generar encoding
         const respuesta = await axios.post('http://127.0.0.1:8000/api/encoding/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });

         const encoding = respuesta.data.encoding;
         let encodingArray = encoding;
         if (typeof encoding === 'string') {
            try {
               encodingArray = JSON.parse(encoding);
            } catch (e) {
               return respuesta.status(400).json({ mensaje: 'Encoding inválido' });
            }
         }

         // 2. Enviar encoding a backend Node.js para guardar en la base de datos
         const res = await axios.put(`${BASE_PATH}/alumno/actualizarEncoding`, {
            matricula: alumno.matricula,
            encoding: encodingArray,
         });

         alert(res.data.mensaje);  // <-- Aquí muestras el alert con el mensaje recibido
         buscarAlumnos();          // Refrescas la lista
      } catch (error) {
         console.error(error);
         alert(`Error al procesar imagen de ${alumno.nombre}`);
      }
   };


   return (
      <div className="container mt-4">
         <h3 className="text-center mb-4" style={{ backgroundColor: '#20c997', color: 'white', padding: '10px' }}>
            Asignar Encodings a Alumnos
         </h3>

         <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por matrícula o nombre"
            className="form-control mb-3"
         />

         {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

         <div className='text-center'>
            <h4>Alumnos sin foto</h4>
         </div>
         <table className="table table-striped">
            <thead>
               <tr>
                  <th>Matrícula</th>
                  <th>Nombre completo</th>
                  <th>Grupo</th>
                  <th>Imagen</th>
               </tr>
            </thead>
            <tbody>
               {resultados.map((alumno) => (
                  <tr key={alumno._id}>
                     <td>{alumno.matricula}</td>
                     <td>{alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}</td>
                     <td>{alumno.grupo}</td>
                     <td>
                        <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => manejarCambioArchivo(e, alumno)}
                        />
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
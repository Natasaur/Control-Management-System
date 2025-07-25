import React from 'react';
import AsistenciaManual from '../components/AsistenciaManual';
import AsistenciaJustificada from '../components/AsistenciaJustificada';
import CsvTabla from '../components/CsvTabla';
import VisualizarA from '../components/VisualizarA';

export default function Asistencias() {
  return (
    <div>
      <h2>Gestión de Asistencias</h2>
      <AsistenciaManual />
      <AsistenciaJustificada />
      <CsvTabla />
      <VisualizarA />
    </div>
  );
}
// Archivo: PaginaInformes.jsx

import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PaginaInformes = () => {
  const [tipoInforme, setTipoInforme] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [mesAno, setMesAno] = useState({ mes: '', ano: '' });
  const [mensajeDescarga, setMensajeDescarga] = useState('');

  const handleGenerarInforme = async () => {
    if (!tipoInforme) {
      alert('Por favor, seleccione un tipo de informe.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/informes/generar', { tipoInforme, frecuencia, fecha, mesAno }, {
        responseType: 'blob',
      });

      // Crear un enlace temporal para descargar el archivo PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');

      // Formatear la fecha para usarla en el nombre del archivo según la frecuencia
      let formattedDate = '';
      if (frecuencia === 'diario') {
        formattedDate = new Date(fecha).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replaceAll('/', '');
      } else if (frecuencia === 'mensual') {
        formattedDate = `${mesAno.mes}${mesAno.ano}`;
      }

      link.href = url;
      link.setAttribute('download', `informe_${tipoInforme.toLowerCase()}_${formattedDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Mostrar mensaje de descarga exitosa
      setMensajeDescarga('El informe se ha descargado correctamente.');
    } catch (error) {
      console.error('Error al generar el informe:', error);
      alert('Hubo un error al generar el informe. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h1>Generar Informe</h1>
        </div>
        <div className="card-body">
          <div className="form-group mb-3">
            <label htmlFor="tipoInforme">Tipo de Informe:</label>
            <select id="tipoInforme" className="form-select" value={tipoInforme} onChange={(e) => setTipoInforme(e.target.value)}>
              <option value="">--Seleccione un informe--</option>
              <option value="Usuarios">Usuarios</option>
              <option value="Clientes">Clientes</option>
              <option value="Motos">Motos</option>
              <option value="Inventario">Inventario</option>
              <option value="OrdenesTrabajo">Órdenes de Trabajo</option>
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="frecuencia">Frecuencia del Informe:</label>
            <select id="frecuencia" className="form-select" value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
              <option value="">--Seleccione la frecuencia--</option>
              <option value="diario">Diario</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>

          {frecuencia === 'diario' && (
            <div className="form-group mb-3">
              <label htmlFor="fecha">Seleccione la Fecha:</label>
              <DatePicker
                id="fecha"
                selected={fecha}
                onChange={(date) => setFecha(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
          )}

          {frecuencia === 'mensual' && (
            <div className="form-group mb-3">
              <label htmlFor="mes">Seleccione el Mes y Año:</label>
              <div className="row">
                <div className="col">
                  <select
                    id="mes"
                    className="form-select"
                    value={mesAno.mes}
                    onChange={(e) => setMesAno({ ...mesAno, mes: e.target.value })}
                  >
                    <option value="">--Mes--</option>
                    <option value="Enero">Enero</option>
                    <option value="Febrero">Febrero</option>
                    <option value="Marzo">Marzo</option>
                    <option value="Abril">Abril</option>
                    <option value="Mayo">Mayo</option>
                    <option value="Junio">Junio</option>
                    <option value="Julio">Julio</option>
                    <option value="Agosto">Agosto</option>
                    <option value="Septiembre">Septiembre</option>
                    <option value="Octubre">Octubre</option>
                    <option value="Noviembre">Noviembre</option>
                    <option value="Diciembre">Diciembre</option>
                  </select>
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Año"
                    value={mesAno.ano}
                    onChange={(e) => setMesAno({ ...mesAno, ano: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          <button className="btn btn-primary" onClick={handleGenerarInforme}>Generar Informe</button>
          {mensajeDescarga && <div className="alert alert-success mt-3">{mensajeDescarga}</div>}
        </div>
      </div>
    </div>
  );
};

export default PaginaInformes;

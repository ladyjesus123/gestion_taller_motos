import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CrearReporte = () => {
  const [formData, setFormData] = useState({
    id_orden: '',
    diagnostico_inicial: '',
    procesos_realizados: '',
    fecha_hora_recepcion: '',
    fecha_hora_entrega: '',
    costo_total: '',
    observaciones_finales: ''
  });
  const [ordenes, setOrdenes] = useState([]);
  const navigate = useNavigate();

  // Obtener las órdenes de trabajo para el selector
  useEffect(() => {
    const obtenerOrdenes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No se encontró un token en localStorage");
          return;
        }

        const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/ordenesTrabajo/listar`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (Array.isArray(respuesta.data)) {
          setOrdenes(respuesta.data);
        } else {
          console.error("La respuesta de ordenes no es un arreglo:", respuesta.data);
        }
      } catch (error) {
        console.error('Error al obtener órdenes:', error);
      }
    };

    obtenerOrdenes();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No se encontró un token en localStorage");
        return;
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reportes_mecanico`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/reportes_mecanico/listar'); // Navegar a la lista de reportes
    } catch (error) {
      console.error('Error al crear el reporte del mecánico:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Crear Nuevo Reporte del Mecánico</h1>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Orden de Trabajo:</label>
          <select
            className="form-select"
            name="id_orden"
            value={formData.id_orden}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Orden de Trabajo</option>
            {ordenes.map((orden) => (
              <option key={orden.id_orden} value={orden.id_orden}>
                Orden ID: {orden.id_orden} - Tipo: {orden.tipo_servicio} - Estado: {orden.estado}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Diagnóstico Inicial:</label>
          <textarea
            className="form-control"
            name="diagnostico_inicial"
            value={formData.diagnostico_inicial}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Procesos Realizados:</label>
          <textarea
            className="form-control"
            name="procesos_realizados"
            value={formData.procesos_realizados}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha y Hora de Recepción:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="fecha_hora_recepcion"
            value={formData.fecha_hora_recepcion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha y Hora de Entrega:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="fecha_hora_entrega"
            value={formData.fecha_hora_entrega}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Costo Total:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="costo_total"
            value={formData.costo_total}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Observaciones Finales:</label>
          <textarea
            className="form-control"
            name="observaciones_finales"
            value={formData.observaciones_finales}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-success" type="submit">
            Guardar Reporte
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => navigate('/reportes_mecanico/listar')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearReporte;

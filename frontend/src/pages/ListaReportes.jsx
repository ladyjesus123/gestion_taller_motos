import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListaReportes = () => {
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  // Función para obtener la lista de reportes
  useEffect(() => {
    const obtenerReportes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No se encontró un token en localStorage");
          return;
        }
        const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/reportes_mecanico/listar`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (Array.isArray(respuesta.data)) {
          setReportes(respuesta.data);
        } else {
          console.error("La respuesta no es un arreglo:", respuesta.data);
        }
      } catch (error) {
        console.error('Error al obtener reportes del mecánico:', error);
      }
    };

    obtenerReportes();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Lista de Reportes del Mecánico</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate('/reportes_mecanico/crear')}
      >
        Crear Nuevo Reporte
      </button>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">N°</th>
              <th scope="col">ID Reporte</th>
              <th scope="col">ID Orden</th>
              <th scope="col">Diagnóstico Inicial</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.length > 0 ? (
              reportes.map((reporte, index) => (
                <tr key={reporte.id_reporte}>
                  <th scope="row">{index + 1}</th>
                  <td>{reporte.id_reporte}</td>
                  <td>{reporte.id_orden}</td>
                  <td>{reporte.diagnostico_inicial}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => navigate(`/reportes_mecanico/detalles/${reporte.id_reporte}`)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/reportes_mecanico/editar/${reporte.id_reporte}`)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No se encontraron reportes del mecánico</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaReportes;

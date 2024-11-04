import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';




const ListaInspecciones = () => {
  const navigate = useNavigate();
  const [inspecciones, setInspecciones] = useState([]);
  const [error, setError] = useState('');

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/inspeccionRecepcion/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Actualizar la lista de inspecciones después de eliminar
      setInspecciones(inspecciones.filter((inspeccion) => inspeccion.id_inspeccion !== id));
    } catch (error) {
      console.error('Error al eliminar la inspección:', error);
      setError('Error al eliminar la inspección. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    const fetchInspecciones = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/inspeccionRecepcion/listar', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setInspecciones(response.data);
      } catch (error) {
        console.error('Error al cargar inspecciones:', error.response ? error.response.data : error.message);
        setError('Error al cargar las inspecciones. Inténtalo de nuevo más tarde.');
      }
    };
    fetchInspecciones();
  }, []);

  // Función para redirigir a la creación de una nueva inspección
  const handleCrearInspeccion = () => {
    navigate('/inspeccion-recepcion');
  };

  // Función para redirigir a los detalles de una inspección
  const handleVerDetalles = (id) => {
    navigate(`/inspeccion-recepcion/detalles/${id}`);
  };


  return (
    <Container className="mt-5">
      <h2>Lista de Inspecciones y Recepciones</h2>
      {error && <p className="text-danger">{error}</p>}
      <Button variant="primary" className="mb-3" onClick={handleCrearInspeccion}>
        Crear Nueva Inspección
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Moto</th>
            <th>Vendedor</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inspecciones.map((inspeccion) => (
            <tr key={inspeccion.id_inspeccion}>
              <td>{inspeccion.id_inspeccion}</td>
              <td>{inspeccion.moto ? `${inspeccion.moto.marca} ${inspeccion.moto.modelo}` : 'No disponible'}</td>
              <td>{inspeccion.vendedor ? inspeccion.vendedor.nombre : 'No disponible'}</td>
              <td>{new Date(inspeccion.createdAt).toLocaleDateString()}</td>
              <td>
              <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleVerDetalles(inspeccion.id_inspeccion)}
                >
                    Ver Detalles
                </Button>
                <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/inspeccion-recepcion/editar/${inspeccion.id_inspeccion}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(inspeccion.id_inspeccion)}
                  >
                    Eliminar
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaInspecciones;

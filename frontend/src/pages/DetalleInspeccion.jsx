import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

const DetalleInspeccion = () => {
  const { id } = useParams(); // Obtenemos el id de la inspección desde los parámetros de la URL
  const navigate = useNavigate();
  const [inspeccion, setInspeccion] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInspeccion = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/inspeccionRecepcion/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setInspeccion(response.data);
      } catch (error) {
        console.error('Error al cargar inspección:', error.response ? error.response.data : error.message);
        setError('Error al cargar la inspección. Inténtalo de nuevo más tarde.');
      }
    };

    fetchInspeccion();
  }, [id]);

  const handleVolver = () => {
    navigate('/inspeccion-recepcion/listar');
  };

  if (error) {
    return (
      <Container className="mt-5">
        <p className="text-danger">{error}</p>
        <Button onClick={handleVolver}>Volver a la lista</Button>
      </Container>
    );
  }

  if (!inspeccion) {
    return (
      <Container className="mt-5">
        <p>Cargando detalles de la inspección...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>Detalles de la Inspección #{inspeccion.id_inspeccion}</Card.Header>
        <Card.Body>
          <p><strong>Moto:</strong> {inspeccion.moto ? `${inspeccion.moto.marca} ${inspeccion.moto.modelo}` : 'No disponible'}</p>
          <p><strong>Vendedor:</strong> {inspeccion.vendedor ? inspeccion.vendedor.nombre : 'No disponible'}</p>
          <p><strong>Mecanico Asignado:</strong> {inspeccion.mecanico ? inspeccion.mecanico.nombre : 'No disponible'}</p>
          <p><strong>Fecha:</strong> {new Date(inspeccion.createdAt).toLocaleDateString()}</p>
          <p><strong>Observaciones:</strong> {inspeccion.observaciones}</p>
          <p><strong>Nivel de Gasolina:</strong> {inspeccion.nivel_gasolina || 'No disponible'}</p>
          <p><strong>Nivel de Aceite:</strong> {inspeccion.nivel_aceite || 'No disponible'}</p>
          <p><strong>Inventario en buen estado:</strong></p>
          {inspeccion.inventario ? (
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {Object.keys(inspeccion.inventario).map((key) => (
                <li key={key}>
                  {key}: {inspeccion.inventario[key] ? 'Sí' : 'No'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No disponible</p>
          )}
         {inspeccion.foto_moto && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '10px' }}>Foto de la Moto:</strong>
            <img
              src={`http://localhost:4000${inspeccion.foto_moto}`}
              alt="Foto de la moto"
              style={{
                maxWidth: '80%',
                height: 'auto',
                border: '5px solid black',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
        )}
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" onClick={handleVolver}>Volver a la lista</Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default DetalleInspeccion;

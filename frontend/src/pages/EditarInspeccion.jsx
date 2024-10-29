import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';

const EditarInspeccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [motos, setMotos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de la inspección existente
        const inspeccionResponse = await axios.get(`http://localhost:4000/api/inspeccionRecepcion/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFormData(inspeccionResponse.data);

        // Obtener lista de motos
        const motosResponse = await axios.get('http://localhost:4000/api/motos/listar');
        if (Array.isArray(motosResponse.data)) {
          setMotos(motosResponse.data);
        }

        // Obtener lista de vendedores
        const vendedoresResponse = await axios.get('http://localhost:4000/api/usuarios', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (Array.isArray(vendedoresResponse.data)) {
          const vendedoresFiltrados = vendedoresResponse.data.filter(
            (usuario) => usuario.rol === 'vendedor'
          );
          setVendedores(vendedoresFiltrados);
        }

        // Obtener lista de mecánicos
        const mecanicosResponse = await axios.get('http://localhost:4000/api/usuarios', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (Array.isArray(mecanicosResponse.data)) {
          const mecanicosFiltrados = mecanicosResponse.data.filter(
            (usuario) => usuario.rol === 'mecanico'
          );
          setMecanicos(mecanicosFiltrados);
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error.response ? error.response.data : error.message);
        setError('Error al cargar los datos. Inténtalo de nuevo más tarde.');
      }
    };

    fetchData();
  }, [id]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar cambios en el inventario
  const handleInventarioChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      inventario: { ...formData.inventario, [name]: checked },
    });
  };

  // Enviar el formulario para actualizar la inspección
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.put(`http://localhost:4000/api/inspeccionRecepcion/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Redirigir a la lista de inspecciones después de editar
      navigate('/inspeccion-recepcion/listar');
    } catch (error) {
      setError('Error al actualizar la inspección. Verifique los datos e inténtelo de nuevo.');
    }
  };

  if (!formData) return <div>Cargando...</div>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Header>Editar Inspección y Recepción de Moto</Card.Header>
            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleSubmit}>
                {/* Campos similares al formulario de creación */}
                <Form.Group controlId="formMoto">
                  <Form.Label>Moto</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_moto"
                    value={formData.id_moto || ''}
                    onChange={handleChange}
                    required>
                    <option value="">Seleccione una moto</option>
                    {motos.map((moto) => (
                      <option key={moto.id_moto} value={moto.id_moto}>
                        {moto.marca} {moto.modelo} ({moto.placa}) - Chasis: {moto.chasis} - Motor: {moto.motor}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {/* Similar para Vendedor y Mecánico Asignado */}
                <Form.Group controlId="formVendedor" className="mt-3">
                  <Form.Label>Vendedor</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_vendedor"
                    value={formData.id_vendedor || ''}
                    onChange={handleChange}
                    required>
                    <option value="">Seleccione un vendedor</option>
                    {vendedores.map((vendedor) => (
                      <option key={vendedor.id_usuario} value={vendedor.id_usuario}>
                        {vendedor.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formMecanico" className="mt-3">
                  <Form.Label>Mecánico Asignado</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_mecanico_asignado"
                    value={formData.id_mecanico_asignado || ''}
                    onChange={handleChange}
                    required>
                    <option value="">Seleccione un mecánico</option>
                    {mecanicos.map((mecanico) => (
                      <option key={mecanico.id_usuario} value={mecanico.id_usuario}>
                        {mecanico.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {/* Similar para los demás campos */}
                <Button variant="primary" type="submit" className="mt-4 me-2">
                  Guardar Cambios
                </Button>
                <Button variant="secondary" className="mt-4" onClick={() => navigate('/inspeccion-recepcion/listar')}>
                  Volver a la lista de Inspecciones
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditarInspeccion;

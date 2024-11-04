// Archivo: componente frontend InspeccionRecepcion.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';

const InspeccionRecepcion = () => {
  const navigate = useNavigate();
  const [motos, setMotos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);

  const initialFormData = {
    id_moto: '',
    id_vendedor: '',
    id_mecanico_asignado: '',
    observaciones: '',
    foto_moto: null,
    inventario: {
      espejos: false,
      asiento: false,
      freno_delantero: false,
      freno_trasero: false,
      direccionales: false,
      llantas: false,
      luz_frontal: false,
      luz_trasera: false,
      retrovisores: false,
      faro_delantero: false,
      pide_vias: false,
      luz_freno: false,
      rayones: false,
      sillon: false,
      tapon_gasolina: false,
    },
    nivel_gasolina: '',
    nivel_aceite: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la lista de motos(GET)
        const motosResponse = await axios.get('http://localhost:4000/api/motos/listar');
        setMotos(motosResponse.data);

        // Obtener la lista de vendedores(GET)
        const vendedoresResponse = await axios.get('http://localhost:4000/api/usuarios', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const vendedoresFiltrados = vendedoresResponse.data.filter((usuario) => usuario.rol === 'vendedor');
        setVendedores(vendedoresFiltrados);

        // Obtener lista de mecánicos(GET)
        const mecanicosResponse = await axios.get('http://localhost:4000/api/usuarios', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const mecanicosFiltrados = mecanicosResponse.data.filter((usuario) => usuario.rol === 'mecanico');
        setMecanicos(mecanicosFiltrados);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Error al cargar los datos. Inténtalo de nuevo más tarde.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInventarioChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      inventario: { ...formData.inventario, [name]: checked },
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto_moto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = new FormData();
    data.append('id_moto', formData.id_moto);
    data.append('id_vendedor', formData.id_vendedor);
    data.append('id_mecanico_asignado', formData.id_mecanico_asignado);
    data.append('observaciones', formData.observaciones);
    data.append('inventario', JSON.stringify(formData.inventario));
    data.append('nivel_gasolina', formData.nivel_gasolina);
    data.append('nivel_aceite', formData.nivel_aceite);
    if (formData.foto_moto) {
      data.append('foto_moto', formData.foto_moto);
    }

    try {
      await axios.post('http://localhost:4000/api/inspeccionRecepcion', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setFormData(initialFormData);
      navigate('/inspeccion-recepcion/listar');
    } catch (error) {
      setError('Error al crear la inspección. Verifique los datos e inténtelo de nuevo.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Header>Crear Inspección y Recepción de Moto</Card.Header>
            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formMoto">
                  <Form.Label>Moto</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_moto"
                    value={formData.id_moto || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una moto</option>
                    {motos.map((moto) => (
                      <option key={moto.id_moto} value={moto.id_moto}>
                        {moto.marca} {moto.modelo} ({moto.placa}) - Chasis: {moto.chasis} - Motor: {moto.motor}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formVendedor" className="mt-3">
                  <Form.Label>Vendedor</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_vendedor"
                    value={formData.id_vendedor || ''}
                    onChange={handleChange}
                    required
                  >
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
                    required
                  >
                    <option value="">Seleccione un mecánico</option>
                    {mecanicos.map((mecanico) => (
                      <option key={mecanico.id_usuario} value={mecanico.id_usuario}>
                        {mecanico.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formInventario" className="mt-3">
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Elemento</th>
                        <th>¿Está en buen estado?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'retrovisores', label: 'Retrovisores' },
                        { name: 'faro_delantero', label: 'Faro delantero' },
                        { name: 'pide_vias', label: 'Pide vías' },
                        { name: 'luz_freno', label: 'Luz de freno' },
                        { name: 'rayones', label: 'Rayones (daño en el plástico)' },
                        { name: 'sillon', label: 'Estado del sillón' },
                        { name: 'tapon_gasolina', label: 'Tapón de gasolina' },
                        { name: 'espejos', label: 'Espejos' },
                        { name: 'asiento', label: 'Asiento' },
                        { name: 'freno_delantero', label: 'Freno delantero' },
                        { name: 'freno_trasero', label: 'Freno trasero' },
                        { name: 'direccionales', label: 'Direccionales' },
                        { name: 'llantas', label: 'Llantas' },
                        { name: 'luz_frontal', label: 'Luz frontal' },
                        { name: 'luz_trasera', label: 'Luz trasera' },
                      ].map((item) => (
                        <tr key={item.name}>
                          <td>{item.label}</td>
                          <td>
                            <Form.Check
                              type="checkbox"
                              name={item.name}
                              checked={formData.inventario[item.name] || false}
                              onChange={handleInventarioChange}
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>Nivel de combustible</td>
                        <td>
                          <Form.Control
                            as="select"
                            name="nivel_gasolina"
                            value={formData.nivel_gasolina || ''}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccione el nivel de gasolina</option>
                            <option value="lleno">Lleno</option>
                            <option value="medio">Medio</option>
                            <option value="vacio">Vacío</option>
                          </Form.Control>
                        </td>
                      </tr>
                      <tr>
                        <td>Nivel de Aceite</td>
                        <td>
                          <Form.Control
                            as="select"
                            name="nivel_aceite"
                            value={formData.nivel_aceite || ''}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccione el nivel de aceite</option>
                            <option value="lleno">Lleno</option>
                            <option value="medio">Medio</option>
                            <option value="vacio">Vacío</option>
                          </Form.Control>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Form.Group>
                <Form.Group controlId="formObservaciones" className="mt-3">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="observaciones"
                    value={formData.observaciones || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formFotoMoto" className="mt-3">
                  <Form.Label>Foto de la Moto</Form.Label>
                  <Form.Control type="file" name="foto_moto" onChange={handleFileChange} />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-4 me-2">
                  Crear Inspección
                </Button>
                <Button variant="secondary" className="mt-4" onClick={() => navigate('/inspeccion-recepcion/listar')}>
                  volver a la lista de Inspecciones
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InspeccionRecepcion;

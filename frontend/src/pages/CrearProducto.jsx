import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const CrearProducto = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async () => {
    try {
      // Obtener el token del almacenamiento local
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autorización');
      }

      // Convertir cantidad y precio a números antes de enviar
      const cantidadInt = parseInt(cantidad, 10);
      const precioFloat = parseFloat(precio);

      // Verificar los datos antes de enviarlos
      console.log({ nombre, descripcion, cantidad: cantidadInt, precio: precioFloat });

      // Hacer la solicitud POST al endpoint correcto con el encabezado de autorización
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/inventario`,
        {
          nombre_producto: nombre,
          descripcion,
          cantidad_stock: cantidadInt,
          precio: precioFloat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Producto creado:', response.data);
      navigate('/inventario');
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    manejarEnvio();
  };

  return (
    <div className="container">
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre del Producto</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Descripción</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Cantidad en Stock</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            min="0"
            required
          />
        </div>
        <div className="mb-3">
          <label>Precio</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            min="0"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Guardar en la Base de Datos
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/inventario')}
        >
          Cancelar
        </button>
      </form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás segura de que deseas crear este producto con los datos proporcionados?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CrearProducto;

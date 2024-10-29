import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditarProducto = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No se encontró el token de autorización');
        }

        // Hacer la solicitud GET con el encabezado de autorización
        const response = await axios.get(`http://localhost:4000/api/inventario/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error('Producto no encontrado');
        }

        const producto = response.data;

        // Verificar si recibimos los datos correctamente
        console.log('Datos del producto recibidos:', producto);

        // Llenar los valores del formulario con los datos del producto
        setNombre(producto.nombre_producto || '');
        setDescripcion(producto.descripcion || '');
        setCantidad(producto.cantidad_stock || '');
        setPrecio(producto.precio || '');
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        setError('No se pudo obtener el producto. Verifica si existe.');
        setCargando(false);
      }
    };

    obtenerProducto();
  }, [id]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autorización');
      }

      await axios.put(
        `http://localhost:4000/api/inventario/${id}`,
        {
          nombre_producto: nombre,
          descripcion,
          cantidad_stock: parseInt(cantidad, 10),
          precio: parseFloat(precio),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/inventario');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  if (cargando) {
    return <div className="container"><p>Cargando datos del producto...</p></div>;
  }

  if (error) {
    return <div className="container"><p className="text-danger">{error}</p></div>;
  }

  return (
    <div className="container">
      <h2>Editar Producto</h2>
      <form onSubmit={manejarEnvio}>
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
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/inventario')}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditarProducto;

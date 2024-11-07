import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autorización');
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventario`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autorización');
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/inventario/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Producto eliminado correctamente');
      obtenerProductos(); // Vuelve a cargar los productos después de eliminar uno
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('No se pudo eliminar el producto. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="container">
      <h2>Lista de Productos</h2>
      <Link to="/inventario/crear" className="btn btn-primary mb-3">Añadir Producto</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id_producto} className={producto.cantidad_stock < 10 ? 'table-warning' : ''}>
              <td>{producto.nombre_producto}</td>
              <td>{producto.descripcion}</td>
              <td>
                {producto.cantidad_stock} 
                {producto.cantidad_stock < 10 && (
                  <span className="text-danger ms-2">(¡Bajo stock!)</span>
                )}
              </td>
              <td>{producto.precio}</td>
              <td>
                <Link to={`/inventario/editar/${producto.id_producto}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    if (window.confirm(`¿Estás segura de que deseas eliminar el producto "${producto.nombre_producto}"?`)) {
                      eliminarProducto(producto.id_producto);
                    }
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProductos;

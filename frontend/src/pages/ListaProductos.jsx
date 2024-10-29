import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No se encontró el token de autorización');
        }

        // Hacer la solicitud GET con el encabezado de autorización
        const response = await axios.get('http://localhost:4000/api/inventario', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    obtenerProductos();
  }, []);

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
          {productos.length > 0 ? (
            productos.map(producto => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre_producto}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.cantidad_stock}</td>
                <td>{producto.precio}</td>
                <td>
                  <Link to={`/inventario/editar/${producto.id_producto}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                  <button className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No hay productos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProductos;

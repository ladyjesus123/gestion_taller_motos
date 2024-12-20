import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PanelNotificaciones = () => {
  const [alertasStock, setAlertasStock] = useState([]);
  const [ordenesAbiertas, setOrdenesAbiertas] = useState([]);

  useEffect(() => {
    obtenerAlertasStock();
    obtenerOrdenesAbiertas();
  }, []);

  const obtenerAlertasStock = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autorización');
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventario/alertas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlertasStock(response.data);
    } catch (error) {
      console.error('Error al obtener las alertas de stock:', error);
    }
  };

  const obtenerOrdenesAbiertas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autorización');
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ordenesTrabajo/abiertas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrdenesAbiertas(response.data);
    } catch (error) {
      console.error('Error al obtener las órdenes abiertas:', error);
    }
  };

  return (
    <div className="panel-notificaciones">
      <div className="alert alert-warning">
        <h4>Alertas de Stock</h4>
        {alertasStock.length > 0 ? (
          <ul>
            {alertasStock.map(alerta => (
              <li key={alerta.id_producto}>
                {alerta.nombre_producto}: {alerta.cantidad_stock} unidades en stock.
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay productos con bajo stock.</p>
        )}
      </div>
    </div>
  );
};

export default PanelNotificaciones;

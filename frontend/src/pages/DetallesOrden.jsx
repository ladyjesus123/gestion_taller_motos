import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DetallesOrden = () => {
    const { id } = useParams();
    const [orden, setOrden] = useState(null);
    const navigate = useNavigate();


    const obtenerDetallesOrden = async () => {
        try {
            // Agregar el token desde localStorage
            const token = localStorage.getItem('token');

            const respuesta = await axios.get(`http://localhost:4000/api/ordenesTrabajo/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrden(respuesta.data);
        } catch (error) {
            console.error('Error al obtener los detalles de la orden de trabajo:', error);
        }
    };

    useEffect(() => {
        obtenerDetallesOrden();
    }, []);

    if (!orden) {
        return <p>Cargando detalles de la orden...</p>;
    }

    // Parte visible al usuario
    return (
        <div className="container mt-4">
            <h1>Detalles de la Orden de Trabajo</h1>
            <p><strong>ID de la Orden:</strong> {orden.id_orden}</p>
            <p><strong>Estado:</strong> {orden.estado}</p>
            <p><strong>Tipo de Servicio:</strong> {orden.tipo_servicio}</p>
            <p><strong>Detalles de Inspección:</strong> {orden.detalle_inspeccion}</p>
            <p><strong>Observaciones:</strong> {orden.observaciones}</p>
            <h3>Información de la Moto</h3>
            <p><strong>Placa:</strong> {orden.moto.placa}</p>
            <p><strong>Marca:</strong> {orden.moto.marca}</p>
            <p><strong>Modelo:</strong> {orden.moto.modelo}</p>
            <div className="d-flex justify-content-between">
            <button className="btn btn-danger" type="button" onClick={() => navigate('/ordenesTrabajo')}>Volver a Órdenes de Trabajo</button>
            </div>

        </div>
    );
};

export default DetallesOrden;

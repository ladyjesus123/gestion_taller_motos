import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListaOrdenes = () => {
    const [ordenes, setOrdenes] = useState([]);
    const navigate = useNavigate();

    // Función para obtener las órdenes de trabajo desde el backend
    const obtenerOrdenes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No se encontró un token en localStorage");
                return;
            }
            const respuesta = await axios.get('http://localhost:4000/api/ordenesTrabajo/listar', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (Array.isArray(respuesta.data)) {
                setOrdenes(respuesta.data);
            } else {
                console.error('La respuesta no es un arreglo:', respuesta.data);
            }
        } catch (error) {
            console.error('Error al obtener órdenes de trabajo:', error);
        }
    };

    useEffect(() => {
        obtenerOrdenes();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Órdenes de Trabajo</h1>
            <button className="btn btn-primary mb-3" onClick={() => navigate('/ordenesTrabajo/crear')}>Crear Nueva Orden</button>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">N°</th>
                            <th scope="col">ID Orden</th>
                            <th scope="col">Placa de Moto</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.length > 0 ? (
                            ordenes.map((orden, index) => (
                                <tr key={orden.id_orden}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{orden.id_orden}</td>
                                    <td>{orden.moto ? orden.moto.placa : 'Sin placa'}</td>
                                    <td>{orden.estado}</td>
                                    <td>
                                        <button className="btn btn-info btn-sm me-2" onClick={() => navigate(`/ordenesTrabajo/detalles/${orden.id_orden}`)}>Ver Detalles</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No se encontraron órdenes de trabajo</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaOrdenes;

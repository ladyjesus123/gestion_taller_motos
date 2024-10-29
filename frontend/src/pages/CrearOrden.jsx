import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CrearOrden = () => {
    const [formData, setFormData] = useState({
        id_moto: '',
        id_inspeccion: '',
        tipo_servicio: '',
        detalle_inspeccion: '',
        observaciones: ''
    });
    const [motos, setMotos] = useState([]);
    const [inspecciones, setInspecciones] = useState([]);

    const navigate = useNavigate();

    // Obtener datos de motos, usuarios e inspecciones para los selectores
    useEffect(() => {
        const obtenerMotos = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("No se encontró un token en localStorage");
                    return;
                }
        
                const respuesta = await axios.get('http://localhost:4000/api/motos/listar', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (Array.isArray(respuesta.data)) {
                    setMotos(respuesta.data);
                } else {
                    console.error("La respuesta de motos no es un arreglo:", respuesta.data);
                }
            } catch (error) {
                console.error('Error al obtener motos:', error);
            }
        };
        
        const obtenerInspecciones = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("No se encontró un token en localStorage");
                    return;
                }
        
                const respuesta = await axios.get('http://localhost:4000/api/inspeccionRecepcion/listar', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (Array.isArray(respuesta.data)) {
                    setInspecciones(respuesta.data);
                } else {
                    console.error("La respuesta de inspecciones no es un arreglo:", respuesta.data);
                }
            } catch (error) {
                console.error('Error al obtener inspecciones:', error);
            }
        };
        
        obtenerMotos();
        obtenerInspecciones();
    }, []);

    useEffect(() => {
        console.log("Motos actuales:", motos);
        console.log("Inspecciones actuales:", inspecciones);
    }, [motos, inspecciones]);

    // Función para manejar cambios en el formulario
    const handleChange = (e) => {
        console.log("Campo cambiado:", e.target.name, "Valor:", e.target.value);
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    // Función para enviar la solicitud de creación al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No se encontró un token en localStorage");
                return;
            }
            await axios.post('http://localhost:4000/api/ordenesTrabajo', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/ordenesTrabajo'); // Regresar a la lista de órdenes
        } catch (error) {
            console.error('Error al crear la orden de trabajo:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Crear Nueva Orden de Trabajo</h1>
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Moto:</label>
                    <select className="form-select" name="id_moto" value={formData.id_moto} onChange={handleChange} required>
                        <option value="">Seleccionar Moto</option>
                        {Array.isArray(motos) &&
                            motos.map((moto) => (
                                <option key={moto.id_moto} value={moto.id_moto}>
                                    {moto.marca} {moto.modelo} ({moto.placa}) - Chasis: {moto.chasis} - Motor: {moto.motor}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Inspección:</label>
                    <select className="form-select" name="id_inspeccion" value={formData.id_inspeccion} onChange={handleChange} required>
                        <option value="">Seleccionar Inspección</option>
                        {Array.isArray(inspecciones) && inspecciones.map((inspeccion) => (
                            <option key={inspeccion.id_inspeccion} value={inspeccion.id_inspeccion}>
                                Inspección ID: {inspeccion.id_inspeccion} - {inspeccion.observaciones}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de Servicio:</label>
                    <select className="form-select" name="tipo_servicio" value={formData.tipo_servicio} onChange={handleChange} required>
                        <option value="">Seleccionar Tipo de Servicio</option>
                        <option value="Primer Servicio">Primer Servicio</option>
                        <option value="Servicio Menor">Servicio Menor</option>
                        <option value="Servicio Mayor">Servicio Mayor</option>
                        <option value="Reparación">Reparación</option>
                        <option value="Revisión">Revisión</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Detalle Inspección:</label>
                    <textarea className="form-control" name="detalle_inspeccion" placeholder="Detalle Inspección" value={formData.detalle_inspeccion} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Observaciones:</label>
                    <textarea className="form-control" name="observaciones" placeholder="Observaciones" value={formData.observaciones} onChange={handleChange}></textarea>
                </div>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-success" type="submit">Guardar Orden</button>
                    <button className="btn btn-danger" type="button" onClick={() => navigate('/ordenesTrabajo')}>Volver a Órdenes de Trabajo</button>
                </div>
            </form>
        </div>
    );
};

export default CrearOrden;

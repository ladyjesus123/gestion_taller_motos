import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetallesReporte = () => {
    const { id } = useParams();
    const [reporte, setReporte] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const navigate = useNavigate();

    // Obtener los detalles del reporte
    const obtenerDetallesReporte = async () => {
        try {
            const token = localStorage.getItem('token');
            const respuesta = await axios.get(`http://localhost:4000/api/reportes_mecanico/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReporte(respuesta.data);
            setNuevoEstado(respuesta.data.ordenTrabajo.estado); // Inicializar el estado con el valor actual
        } catch (error) {
            console.error('Error al obtener los detalles del reporte:', error);
        }
    };

    useEffect(() => {
        obtenerDetallesReporte();
    }, []);

    // Manejar cambio de estado de la orden de trabajo
    const manejarCambioEstado = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:4000/api/ordenesTrabajo/${reporte.id_orden}`, {
                estado: nuevoEstado,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Estado de la orden actualizado correctamente');
            obtenerDetallesReporte(); // Actualizar los detalles después de modificar el estado
        } catch (error) {
            console.error('Error al actualizar el estado de la orden de trabajo:', error);
        }
    };

    if (!reporte) {
        return <p>Cargando detalles del reporte...</p>;
    }

    return (
        <div className="container mt-4">
            <h1>Detalles del Reporte del Mecánico</h1>
            <p><strong>ID del Reporte:</strong> {reporte.id_reporte}</p>
            <p><strong>Diagnóstico Inicial:</strong> {reporte.diagnostico_inicial}</p>
            <p><strong>Procesos Realizados:</strong> {reporte.procesos_realizados}</p>
            <p><strong>Fecha y Hora de Recepción:</strong> {reporte.fecha_hora_recepcion}</p>
            <p><strong>Fecha y Hora de Entrega:</strong> {reporte.fecha_hora_entrega}</p>
            <p><strong>Observaciones Finales:</strong> {reporte.observaciones_finales}</p>

            <h3>Información de la Orden de Trabajo</h3>
            <p><strong>ID de la Orden:</strong> {reporte.ordenTrabajo.id_orden}</p>
            <p><strong>Tipo de Servicio:</strong> {reporte.ordenTrabajo.tipo_servicio}</p>

            <div className="mb-3">
                <label className="form-label"><strong>Estado de la Orden:</strong></label>
                <select
                    className="form-select"
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    disabled={reporte.ordenTrabajo.estado === 'cerrada'}
                >
                    <option value="abierta">Abierta</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="cerrada">Cerrada</option>
                </select>
            </div>

            {reporte.ordenTrabajo.estado !== 'cerrada' && (
                <button
                    className="btn btn-primary mt-3"
                    onClick={manejarCambioEstado}
                >
                    Actualizar Estado de la Orden
                </button>
            )}

            <button
                className="btn btn-secondary mt-3 ms-2"
                onClick={() => navigate('/reportes_mecanico/listar')}
            >
                Volver a Reportes del Mecánico
            </button>
        </div>
    );
};

export default DetallesReporte;

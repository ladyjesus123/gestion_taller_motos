import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditarReporte = () => {
    const { id } = useParams();
    const [reporte, setReporte] = useState(null);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    // Obtener los detalles del reporte para editar
    const obtenerReporte = async () => {
        try {
            const token = localStorage.getItem('token');
            const respuesta = await axios.get(`http://localhost:4000/api/reportes_mecanico/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReporte(respuesta.data);
            setCargando(false);
        } catch (error) {
            console.error('Error al obtener los detalles del reporte:', error);
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerReporte();
    }, []);

    // Manejar los cambios en el formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setReporte({
            ...reporte,
            [name]: value,
        });
    };

    // Manejar el envío del formulario
    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:4000/api/reportes_mecanico/${id}`, {
                diagnostico_inicial: reporte.diagnostico_inicial,
                procesos_realizados: reporte.procesos_realizados,
                fecha_hora_recepcion: reporte.fecha_hora_recepcion,
                fecha_hora_entrega: reporte.fecha_hora_entrega,
                observaciones_finales: reporte.observaciones_finales,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Reporte actualizado correctamente');
            navigate('/reportes');
        } catch (error) {
            console.error('Error al actualizar el reporte:', error);
        }
    };

    if (cargando) {
        return <p>Cargando detalles del reporte...</p>;
    }

    // Verificar si la orden está cerrada para deshabilitar la edición
    if (reporte.ordenTrabajo.estado === 'cerrada') {
        return (
            <div className="container mt-4">
                <h1>Detalles del Reporte del Mecánico</h1>
                <p><strong>ID del Reporte:</strong> {reporte.id_reporte}</p>
                <p><strong>Diagnóstico Inicial:</strong> {reporte.diagnostico_inicial}</p>
                <p><strong>Procesos Realizados:</strong> {reporte.procesos_realizados}</p>
                <p><strong>Fecha y Hora de Recepción:</strong> {reporte.fecha_hora_recepcion}</p>
                <p><strong>Fecha y Hora de Entrega:</strong> {reporte.fecha_hora_entrega}</p>
                <p><strong>Observaciones Finales:</strong> {reporte.observaciones_finales}</p>

                <button
                    className="btn btn-secondary mt-3"
                    onClick={() => navigate('/reportes_mecanico/listar')}
                >
                    Volver a Reportes del Mecánico
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1>Editar Reporte del Mecánico</h1>
            <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                    <label className="form-label">Diagnóstico Inicial:</label>
                    <textarea
                        className="form-control"
                        name="diagnostico_inicial"
                        value={reporte.diagnostico_inicial}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Procesos Realizados:</label>
                    <textarea
                        className="form-control"
                        name="procesos_realizados"
                        value={reporte.procesos_realizados}
                        onChange={manejarCambio}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha y Hora de Recepción:</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha_hora_recepcion"
                        value={reporte.fecha_hora_recepcion}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha y Hora de Entrega:</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha_hora_entrega"
                        value={reporte.fecha_hora_entrega}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Observaciones Finales:</label>
                    <textarea
                        className="form-control"
                        name="observaciones_finales"
                        value={reporte.observaciones_finales}
                        onChange={manejarCambio}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/reportes_mecanico/listar')}>Cancelar</button>
            </form>
        </div>
    );
};

export default EditarReporte;

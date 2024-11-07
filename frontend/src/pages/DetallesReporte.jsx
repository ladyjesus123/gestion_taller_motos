import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

const DetallesReporte = () => {
    const { id } = useParams();
    const [reporte, setReporte] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const navigate = useNavigate();

    // Función para generar el PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        
        // Colores personalizados de la empresa
        const verdeSuave = '#81c784';
        const rojo = '#e53935';
        const azulOscuro = '#1e88e5';

        // Establecer el encabezado
        doc.setFontSize(22);
        doc.setTextColor(azulOscuro);
        doc.text('Ticket de Costos - Orden de Trabajo', 10, 20);
        doc.setFontSize(14);
        doc.setTextColor('#000000');
        doc.text(`Orden ID: ${reporte.ordenTrabajo.id_orden}`, 10, 30);

        // Dibujar una línea bajo el título
        doc.setDrawColor(azulOscuro);
        doc.line(10, 32, 200, 32);

        // Sección de detalles del reporte
        doc.setFontSize(16);
        doc.setTextColor(verdeSuave);
        doc.text('Detalles del Reporte:', 10, 45);

        doc.setFontSize(12);
        doc.setTextColor('#000000');
        doc.setFillColor(verdeSuave);
        doc.rect(10, 50, 190, 8, 'F');
        doc.setTextColor('#FFFFFF');
        doc.text(`Diagnóstico Inicial: ${reporte.diagnostico_inicial || 'N/A'}`, 12, 55);

        doc.setTextColor('#000000');
        doc.text(`Procesos Realizados: ${reporte.procesos_realizados || 'N/A'}`, 10, 70);
        doc.text(`Fecha de Recepción: ${reporte.fecha_hora_recepcion || 'N/A'}`, 10, 80);
        doc.text(`Fecha de Entrega: ${reporte.fecha_hora_entrega || 'N/A'}`, 10, 90);
        const costoTotal = parseFloat(reporte.costo_total) || 0.00;
        doc.setTextColor(rojo);
        doc.text(`Costo Total: Q${costoTotal.toFixed(2)}`, 10, 100);

        doc.setTextColor('#000000');
        doc.text(`Observaciones Finales: ${reporte.observaciones_finales || 'N/A'}`, 10, 110);

        // Información de la orden de trabajo
        doc.setFontSize(16);
        doc.setTextColor(verdeSuave);
        doc.text('Información de la Orden de Trabajo:', 10, 125);

        doc.setFontSize(12);
        doc.setTextColor('#000000');
        doc.text(`ID de la Orden: ${reporte.ordenTrabajo.id_orden}`, 10, 135);
        doc.text(`Tipo de Servicio: ${reporte.ordenTrabajo.tipo_servicio}`, 10, 145);

        // Guardar el PDF con un nombre específico
        doc.save(`Ticket_Costos_Orden_${reporte.ordenTrabajo.id_orden}.pdf`);
    };

    // Obtener los detalles del reporte
    const obtenerDetallesReporte = async () => {
        try {
            const token = localStorage.getItem('token');
            const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/reportes_mecanico/${id}`, {
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
            await axios.put(`${import.meta.env.VITE_API_URL}/api/ordenesTrabajo/${reporte.id_orden}`, {
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

            {/* Botón para generar el PDF */}
            <button
                className="btn btn-success mt-3 ms-2"
                onClick={generarPDF}
            >
                Generar Ticket de Costos en PDF
            </button>

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

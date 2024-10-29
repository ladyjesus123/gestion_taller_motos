const express = require('express');
const router = express.Router();
const ReporteMecanico = require('../models/ReporteMecanico');
const OrdenTrabajo = require('../models/OrdenTrabajo');
const Usuario = require('../models/Usuario');
const { verificarToken, verificarRol } = require('../auth/middleware');

// Crear un nuevo reporte mecánico (POST)
router.post('/', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const {
            id_orden,
            id_mecanico,
            diagnostico_inicial,
            procesos_realizados,
            fecha_hora_recepcion,
            fecha_hora_entrega,
            costo_total,
            observaciones_finales
        } = req.body;

        // Verificación de datos requeridos
        if (!id_orden || !id_mecanico || !diagnostico_inicial || !procesos_realizados || !fecha_hora_recepcion || !fecha_hora_entrega || !costo_total) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben ser proporcionados' });
        }

        const nuevoReporte = await ReporteMecanico.create({
            id_orden,
            id_mecanico,
            diagnostico_inicial,
            procesos_realizados,
            fecha_hora_recepcion,
            fecha_hora_entrega,
            costo_total,
            observaciones_finales
        });

        res.status(201).json(nuevoReporte);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el reporte del mecánico', detalles: error.message });
    }
});

// Obtener todos los reportes mecánicos (GET)
router.get('/', verificarToken, verificarRol(['Administrador', 'mecanico']), async (req, res) => {
    try {
        const reportes = await ReporteMecanico.findAll({
            include: [
                { model: OrdenTrabajo, as: 'ordenTrabajo' },
                { model: Usuario, as: 'mecanico' }
            ]
        });
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los reportes mecánicos', detalles: error.message });
    }
});

// Actualizar un reporte mecánico (PUT)
router.put('/:id', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            diagnostico_inicial,
            procesos_realizados,
            fecha_hora_recepcion,
            fecha_hora_entrega,
            costo_total,
            observaciones_finales
        } = req.body;

        const reporte = await ReporteMecanico.findByPk(id);
        if (!reporte) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }

        await reporte.update({
            diagnostico_inicial,
            procesos_realizados,
            fecha_hora_recepcion,
            fecha_hora_entrega,
            costo_total,
            observaciones_finales
        });
        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el reporte', detalles: error.message });
    }
});

// Eliminar un reporte mecánico (DELETE)
router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { id } = req.params;

        const reporte = await ReporteMecanico.findByPk(id);
        if (!reporte) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }

        await reporte.destroy();
        res.status(200).json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el reporte', detalles: error.message });
    }
});

module.exports = router;

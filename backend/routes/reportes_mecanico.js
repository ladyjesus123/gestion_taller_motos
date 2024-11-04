const express = require('express');
const router = express.Router();
const ReporteMecanico = require('../models/ReporteMecanico');
const OrdenTrabajo = require('../models/OrdenTrabajo');
const InspeccionRecepcion = require('../models/InspeccionRecepcion');
const { verificarToken, verificarRol } = require('../auth/middleware');

// Crear un nuevo Reporte del Mecánico (POST)
router.post('/', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const {
            id_orden,
            diagnostico_inicial,
            procesos_realizados,
            fecha_hora_recepcion,
            fecha_hora_entrega,
            observaciones_finales,
            costo_total
        } = req.body;

        // Verificación de que todos los campos requeridos están presentes
        if (!id_orden || !diagnostico_inicial || !procesos_realizados) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben ser proporcionados' });
        }

        // Buscar la orden de trabajo con la inspección vinculada
        const orden = await OrdenTrabajo.findOne({
            where: { id_orden: id_orden },
            include: [{ model: InspeccionRecepcion, as: 'inspeccion' }]
        });

        if (!orden) {
            return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
        }

        // Obtener el mecánico asignado desde la inspección
        const id_mecanico = orden.inspeccion?.id_mecanico_asignado;
        if (!id_mecanico) {
            return res.status(400).json({ error: 'No se ha asignado un mecánico a esta inspección.' });
        }

        // Crear el nuevo reporte del mecánico
        const nuevoReporte = await ReporteMecanico.create({
            id_orden,
            id_mecanico,
            diagnostico_inicial,
            procesos_realizados,
            fecha_hora_recepcion,
            fecha_hora_entrega,
            observaciones_finales,
            costo_total
        });

        res.status(201).json(nuevoReporte);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el reporte del mecánico', detalles: error.message });
    }
});

// Obtener todos los Reportes del Mecánico (GET)
router.get('/listar', verificarToken, verificarRol(['Administrador', 'mecanico','vendedor']), async (req, res) => {
    try {
        const reportes = await ReporteMecanico.findAll({
            include: [
                {
                    model: OrdenTrabajo,
                    as: 'ordenTrabajo',
                    attributes: ['id_orden', 'tipo_servicio', 'estado']
                }
            ]
        });
        res.status(200).json(reportes);
        
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los reportes del mecánico', detalles: error.message });
    }
});

// Obtener un Reporte del Mecánico por ID (GET)
router.get('/:id', verificarToken, verificarRol(['Administrador', 'mecanico']), async (req, res) => {
    try {
        const { id } = req.params;

        const reporte = await ReporteMecanico.findByPk(id, {
            include: [
                {
                    model: OrdenTrabajo,
                    as: 'ordenTrabajo',
                    attributes: ['id_orden', 'tipo_servicio', 'estado']
                }
            ]
        });

        if (!reporte) {
            return res.status(404).json({ error: 'Reporte del mecánico no encontrado' });
        }

        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el reporte del mecánico', detalles: error.message });
    }
});

// Actualizar un Reporte del Mecánico (PUT)
router.put('/:id', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            diagnostico_inicial,
            procesos_realizados,
            fecha_hora_recepcion,
            fecha_hora_entrega,
            observaciones_finales,
            estado_orden,
            costo_total
        } = req.body;

        // Buscar el reporte
        const reporte = await ReporteMecanico.findByPk(id);
        if (!reporte) {
            return res.status(404).json({ error: 'Reporte del mecánico no encontrado' });
        }

        // Actualizar el reporte con los datos proporcionados
        await reporte.update({
            diagnostico_inicial,
            procesos_realizados,
            fecha_hora_recepcion,
            fecha_hora_entrega,
            observaciones_finales,
            estado_orden,
            costo_total
        });

        // Actualizar el estado de la orden de trabajo si es necesario
        if (estado_orden) {
            const orden = await OrdenTrabajo.findByPk(reporte.id_orden);
            if (orden) {
                await orden.update({ estado: estado_orden });
            }
        }

        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el reporte del mecánico', detalles: error.message });
    }
});

module.exports = router;

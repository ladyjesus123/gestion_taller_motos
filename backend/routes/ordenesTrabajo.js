const express = require('express');
const router = express.Router();
const OrdenTrabajo = require('../models/OrdenTrabajo');
const InspeccionRecepcion = require('../models/InspeccionRecepcion');
const Usuario = require('../models/Usuario');
const Moto = require('../models/Moto');
const { verificarToken, verificarRol } = require('../auth/middleware');

// Crear una nueva Orden de Trabajo
router.post('/', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const {
            id_moto, 
            id_inspeccion,
            tipo_servicio, 
            detalle_inspeccion, 
            observaciones, 
            estado
        } = req.body;

        // Verificación de datos requeridos
        if (!id_moto || !id_inspeccion || !tipo_servicio || !detalle_inspeccion) {
            return res.status(400).json({ error: 'id_moto, id_inspeccion, tipo_servicio, y detalle_inspeccion son obligatorios' });
        }

        // Buscar la inspección para obtener el mecánico asignado
        const inspeccion = await InspeccionRecepcion.findByPk(id_inspeccion);
        if (!inspeccion) {
            return res.status(404).json({ error: 'Inspección no encontrada' });
        }

        // Usamos el `id_mecanico_asignado` de la inspección para crear la orden de trabajo
        const nuevaOrden = await OrdenTrabajo.create({
            id_moto,
            id_usuario: inspeccion.id_mecanico_asignado, // Asignar automáticamente el mecánico de la inspección
            id_inspeccion,
            tipo_servicio,
            detalle_inspeccion,
            observaciones,
            estado: estado || 'abierta' // Si no se proporciona un estado, usar 'abierta' por defecto
        });

        res.status(201).json(nuevaOrden);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la orden de trabajo', detalles: error.message });
    }
});

// Obtener todas las Órdenes de Trabajo
router.get('/listar', verificarToken, verificarRol(['Administrador','vendedor','mecanico']), async (req, res) => {
    try {
        const ordenes = await OrdenTrabajo.findAll({
            include: [
                { model: InspeccionRecepcion, as: 'inspeccion' },
                { model: Usuario, as: 'usuario' },
                {
                    model: Moto,
                    attributes: ['id_moto', 'placa', 'marca', 'modelo'],
                    as: 'moto' // Usar el alias correcto definido en la relación
                }
            ]
        });
        res.status(200).json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes de trabajo', detalles: error.message });
    }
});

// Obtener una Orden de Trabajo por ID
router.get('/:id', verificarToken, verificarRol(['Administrador', 'vendedor', 'mecanico']), async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el parámetro `id` es un número válido
        if (isNaN(id)) {
            return res.status(400).json({ error: 'El ID proporcionado no es válido' });
        }

        // Buscar la orden de trabajo con sus relaciones
        const orden = await OrdenTrabajo.findByPk(id, {
            include: [
                { model: InspeccionRecepcion, as: 'inspeccion' }, // Asegúrate que el alias coincide
                { model: Usuario, as: 'usuario' }, // Asegúrate que el alias coincide
                {
                    model: Moto,
                    attributes: ['id_moto', 'placa', 'marca', 'modelo'],
                    as: 'moto' // Asegúrate que el alias coincide
                }
            ]
        });

        // Si no se encuentra la orden, devolver error 404
        if (!orden) {
            return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
        }

        // Devolver la orden encontrada
        res.status(200).json(orden);
    } catch (error) {
        // Registrar un log detallado del error
        console.error('Error al obtener los detalles de la orden de trabajo:', error.message);
        res.status(500).json({ error: 'Error al obtener los detalles de la orden de trabajo', detalles: error.message });
    }
});


// Actualizar una Orden de Trabajo
router.put('/:id', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_servicio, estado, detalle_inspeccion, observaciones } = req.body;

        const orden = await OrdenTrabajo.findByPk(id);
        if (!orden) {
            return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
        }

        await orden.update({ tipo_servicio, estado, detalle_inspeccion, observaciones });
        res.status(200).json(orden);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la orden de trabajo', detalles: error.message });
    }
});

// Cerrar una Orden de Trabajo
router.put('/:id/cerrar', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await OrdenTrabajo.findByPk(id);
        if (!orden) {
            return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
        }

        await orden.update({ estado: 'cerrada' });
        res.status(200).json(orden);
    } catch (error) {
        res.status(500).json({ error: 'Error al cerrar la orden de trabajo', detalles: error.message });
    }
});

module.exports = router;

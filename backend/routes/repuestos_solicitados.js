const express = require('express');
const router = express.Router();
const RepuestoSolicitado = require('../models/RepuestoSolicitado');
const OrdenTrabajo = require('../models/OrdenTrabajo'); // Asegúrate de importar correctamente el modelo OrdenTrabajo
const Inventario = require('../models/Inventario'); // Importar Inventario
const { verificarToken, verificarRol } = require('../auth/middleware');

// Crear un nuevo repuesto solicitado (POST)
router.post('/', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const { id_orden, id_producto, cantidad, estado_autorizacion } = req.body;

        // Verificación de datos requeridos
        if (!id_orden || !id_producto || !cantidad) {
            return res.status(400).json({ error: 'id_orden, id_producto y cantidad son obligatorios' });
        }

        const nuevoRepuesto = await RepuestoSolicitado.create({
            id_orden,
            id_producto,
            cantidad,
            estado_autorizacion
        });

        res.status(201).json(nuevoRepuesto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el repuesto solicitado', detalles: error.message });
    }
});

// Obtener todos los repuestos solicitados (GET)
router.get('/', verificarToken, verificarRol(['Administrador', 'mecanico']), async (req, res) => {
    try {
        const repuestos = await RepuestoSolicitado.findAll({
            include: [
                { model: OrdenTrabajo, as: 'ordenTrabajo' },
                { model: Inventario, as: 'producto' }
            ]
        });
        res.status(200).json(repuestos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los repuestos solicitados', detalles: error.message });
    }
});

// Actualizar un repuesto solicitado (PUT)
router.put('/:id', verificarToken, verificarRol(['mecanico', 'Administrador']), async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad, estado_autorizacion } = req.body;

        const repuesto = await RepuestoSolicitado.findByPk(id);
        if (!repuesto) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }

        await repuesto.update({ cantidad, estado_autorizacion });
        res.status(200).json(repuesto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el repuesto solicitado', detalles: error.message });
    }
});

// Eliminar un repuesto solicitado (DELETE)
router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { id } = req.params;

        const repuesto = await RepuestoSolicitado.findByPk(id);
        if (!repuesto) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }

        await repuesto.destroy();
        res.status(200).json({ message: 'Repuesto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el repuesto solicitado', detalles: error.message });
    }
});

module.exports = router;

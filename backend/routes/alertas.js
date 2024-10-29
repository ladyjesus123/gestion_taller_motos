const express = require('express');
const router = express.Router();
const Alerta = require('../models/Alerta');
const { verificarToken, verificarRol } = require('../auth/middleware');

// Crear una nueva alerta (POST)
router.post('/', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { id_moto, id_cliente, tipo_alerta, fecha_alerta, estado } = req.body;

        // Verificación de datos requeridos
        if (!id_moto || !id_cliente) {
            return res.status(400).json({ error: 'id_moto e id_cliente son obligatorios' });
        }

        const nuevaAlerta = await Alerta.create({
            id_moto,
            id_cliente,
            tipo_alerta,
            fecha_alerta,
            estado
        });

        res.status(201).json(nuevaAlerta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la alerta', detalles: error.message });
    }
});

// Obtener todas las alertas (GET)
router.get('/', verificarToken, verificarRol(['Administrador', 'mecanico']), async (req, res) => {
    try {
        const alertas = await Alerta.findAll({
            include: [
                { association: 'moto' },
                { association: 'cliente' }
            ]
        });
        res.status(200).json(alertas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las alertas', detalles: error.message });
    }
});

// Actualizar una alerta (PUT)
router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_alerta, estado, fecha_alerta } = req.body;

        const alerta = await Alerta.findByPk(id);
        if (!alerta) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }

        await alerta.update({ tipo_alerta, estado, fecha_alerta });
        res.status(200).json(alerta);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la alerta', detalles: error.message });
    }
});

// Eliminar una alerta (DELETE)
router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { id } = req.params;

        const alerta = await Alerta.findByPk(id);
        if (!alerta) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }

        await alerta.destroy();
        res.status(200).json({ message: 'Alerta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la alerta', detalles: error.message });
    }
});

module.exports = router;

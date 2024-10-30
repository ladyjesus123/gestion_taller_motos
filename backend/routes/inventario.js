const express = require('express');
const router = express.Router();
const Inventario = require('../models/Inventario');
const { Op } = require('sequelize');
const { verificarToken, verificarRol } = require('../auth/middleware');

// Obtener productos con bajo stock (GET)
router.get('/alertas', verificarToken, verificarRol(['Administrador', 'mecanico', 'vendedor']), async (req, res) => {
    try {
        const repuestos = await Inventario.findAll({
            where: {
                cantidad_stock: {
                    [Op.lt]: 10,  // Productos con menos de 10 unidades en stock
                },
            },
        });
        res.status(200).json(repuestos);
    } catch (error) {
        console.error('Error en el endpoint de alertas de stock:', error); // Log para verificar el error
        res.status(500).json({ error: 'Error al obtener las alertas de stock', detalles: error.message });
    }
});



// Obtener todos los repuestos en el inventario (GET)
router.get('/', verificarToken, verificarRol(['Administrador', 'mecanico', 'vendedor']), async (req, res) => {
    try {
        const repuestos = await Inventario.findAll();
        res.status(200).json(repuestos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los repuestos', detalles: error.message });
    }
});

// Obtener un repuesto específico por ID (GET)
router.get('/:id', verificarToken, verificarRol(['Administrador', 'mecanico', 'vendedor']), async (req, res) => {
    try {
        const { id } = req.params;
        const repuesto = await Inventario.findByPk(id);
        if (!repuesto) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }
        res.status(200).json(repuesto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el repuesto', detalles: error.message });
    }
});


// Agregar un nuevo repuesto al inventario (POST)
router.post('/', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { nombre_producto, descripcion, cantidad_stock, precio } = req.body;
        const nuevoRepuesto = await Inventario.create({
            nombre_producto,
            descripcion,
            cantidad_stock,
            precio
        });
        res.status(201).json(nuevoRepuesto);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el repuesto', detalles: error.message });
    }
});

// Actualizar un repuesto en el inventario (PUT)
router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_producto, descripcion, cantidad_stock, precio } = req.body;

        const repuesto = await Inventario.findByPk(id);
        if (!repuesto) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }

        await repuesto.update({ nombre_producto, descripcion, cantidad_stock, precio });
        res.status(200).json(repuesto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el repuesto', detalles: error.message });
    }
});

// Eliminar un repuesto del inventario (DELETE)
router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { id } = req.params;

        const repuesto = await Inventario.findByPk(id);
        if (!repuesto) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }

        await repuesto.destroy();
        res.status(200).json({ message: 'Repuesto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el repuesto', detalles: error.message });
    }
});

module.exports = router;

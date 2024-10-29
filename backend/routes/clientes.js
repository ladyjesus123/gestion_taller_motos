const express = require('express');
const Cliente = require('../models/Cliente');

const router = express.Router();

// Ruta y controlador para obtener todos los clientes (GET)
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta y controlador para crear un nuevo cliente (POST)
router.post('/', async (req, res) => {
  try {
    const nuevoCliente = await Cliente.create(req.body);
    res.json(nuevoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Rutay controlador para actualizar un cliente existente(PUT)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    await cliente.update(req.body);
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    await cliente.destroy();
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
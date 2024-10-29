const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
      const { correo, contraseña } = req.body;
      console.log('Datos recibidos en el login:', correo, contraseña);
  
      // Buscar el usuario por correo
      const usuario = await Usuario.findOne({ where: { correo } });
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Verificar la contraseña
      const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
      console.log('¿La contraseña es válida?', esValida); 
      
  
      if (!esValida) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
  
      // Generar token JWT
      const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'tu_secreto_jwt', { expiresIn: '1h' });
      res.json({ token });
  
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión', detalles: error.message });
    }
  });
  
module.exports = router;

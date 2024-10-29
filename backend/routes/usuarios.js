const express = require('express'); 
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verificarToken, verificarRol } = require('../auth/middleware');

// Iniciar sesión para obtener token JWT
router.post('/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return res.status(403).json({ error: 'Usuario inactivo. Acceso denegado.' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol, activo: usuario.activo },
            'clave_secreta',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión', detalles: error.message });
    }
});

// Crear un nuevo usuario
router.post('/inicial', async (req, res) => {
    try {
        const { nombre, correo, contraseña, rol, activo } = req.body;
        const contraseñaHash = await bcrypt.hash(contraseña, 10);
        const nuevoUsuario = await Usuario.create({
            nombre,
            correo,
            rol,
            contraseña: contraseñaHash,
            contraseña_visible: contraseña,
            activo: activo !== undefined ? activo : true
        });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario', detalles: error.message });
    }
});

// Obtener lista de usuarios (restringido a usuarios autenticados)
router.get('/', verificarToken, async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar los usuarios' });
    }
});

// Ruta para actualizar un usuario existente (restringido a usuarios autenticados)
router.put('/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID del usuario de los parámetros de la URL
        const usuario = await Usuario.findByPk(id);
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizamos el usuario con los datos proporcionados en el cuerpo de la solicitud
        await usuario.update(req.body);
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

module.exports = router;

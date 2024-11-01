const express = require('express');
const router = express.Router();
const multer = require('multer');
const InspeccionRecepcion = require('../models/InspeccionRecepcion');
const Moto = require('../models/Moto');
const Usuario = require('../models/Usuario');
const { verificarToken, verificarRol } = require('../auth/middleware');

// Configuracion de Multer para almacenar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Crear una inspección con la subida de una imagen(POST) (foto de la moto)
router.post('/', verificarToken, verificarRol(['vendedor', 'Administrador']), upload.single('foto_moto'), async (req, res) => {
    try {
        const { id_moto, id_vendedor, inventario, observaciones, nivel_gasolina, nivel_aceite } = req.body;
        const foto_moto = req.file ? `/uploads/${req.file.filename}` : null;

        const nuevaInspeccion = await InspeccionRecepcion.create({
            id_moto,
            id_vendedor,
            inventario: JSON.parse(inventario), // inventario se hace como un objeto JSON para poder poner el check que pide el cliente
            observaciones,
            nivel_gasolina,
            nivel_aceite,
            foto_moto,
        });

        res.status(201).json(nuevaInspeccion);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear inspección', detalles: error.message });
    }
});


// Obtener inspecciones pendientes para asignar a una orden de trabajo (GET)
router.get('/pendientes', verificarToken, verificarRol(['Administrador', 'vendedor']), async (req, res) => {
    try {
        const inspeccionesPendientes = await InspeccionRecepcion.findAll({
            where: {
                estado: 'Pendiente',
            },
        });
        res.status(200).json(inspeccionesPendientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las inspecciones pendientes', detalles: error.message });
    }
});


// Listar todas las Inspecciones y Recepciones(GET)
router.get('/listar', verificarToken, verificarRol(['Administrador', 'vendedor', 'mecanico']), async (req, res) => {
    try {
        const inspecciones = await InspeccionRecepcion.findAll({
            include: [
                { model: Moto, as: 'moto' },
                { model: Usuario, as: 'mecanico' },
                { model: Usuario, as: 'vendedor' }
            ]
        });
        res.json(inspecciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar inspecciones', detalles: error.message });
    }
});

// Ruta y controlador para obtener una inspección específica (GET/ID)
router.get('/:id', verificarToken, verificarRol(['Administrador', 'vendedor', 'mecanico']), async (req, res) => {
    try {
        const { id } = req.params;
        const inspeccion = await InspeccionRecepcion.findOne({
            where: { id_inspeccion: id },
            include: [
                { model: Moto, as: 'moto' }, // alias definido en el modelo
                { model: Usuario, as: 'mecanico' }, // alias definido en el modelo
                { model: Usuario, as: 'vendedor' }  // alias definido en el modelo
            ]
        });

        if (!inspeccion) {
            return res.status(404).json({ error: 'Inspección no encontrada' });
        }

        res.json(inspeccion);
    } catch (error) {
        console.error('Error al obtener la inspección:', error.message);
        res.status(500).json({ error: 'Error al obtener la inspección', detalles: error.message });
    }
});


// ruta y controlador para actualizar Inspección (PUT) (asignar mecánico, actualizar estado, agregar observaciones)
router.put('/:id', verificarToken, verificarRol(['mecanico', 'Administrador', 'vendedor']), upload.single('foto_moto'), async (req, res) => {
    try {
        const { id } = req.params;
        const { id_mecanico_asignado, estado, observaciones } = req.body;
        const foto_moto = req.file ? `/uploads/${req.file.filename}` : null;

        // Agregar mensajes de registro para ver porque me sale error, luego lo quito
        console.log('ID:', id);
        console.log('Estado recibido:', estado);
        console.log('Mecánico asignado:', id_mecanico_asignado);
        console.log('Observaciones:', observaciones);
        console.log('Foto recibida:', foto_moto);

        const inspeccion = await InspeccionRecepcion.findByPk(id);
        if (!inspeccion) {
            return res.status(404).json({ error: 'Inspección no encontrada' });
        }

        inspeccion.id_mecanico_asignado = id_mecanico_asignado || inspeccion.id_mecanico_asignado;
        inspeccion.estado = estado || inspeccion.estado;
        inspeccion.observaciones = observaciones || inspeccion.observaciones;
        if (foto_moto) {
            inspeccion.foto_moto = foto_moto;
        }

        await inspeccion.save();

        res.json(inspeccion);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar inspección', detalles: error.message });
    }
});

//Ruta y controlador para Eliminar Inspección (DELETE)
router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { id } = req.params;
        const inspeccion = await InspeccionRecepcion.findByPk(id);
        if (!inspeccion) {
            return res.status(404).json({ error: 'Inspección no encontrada' });
        }

        await inspeccion.destroy();
        res.json({ mensaje: 'Inspección eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar inspección', detalles: error.message });
    }
});


module.exports = router;

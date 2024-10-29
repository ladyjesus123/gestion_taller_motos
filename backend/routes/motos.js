// Archivo: motos.js (Ruta)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Moto = require('../models/Moto');
const Cliente = require('../models/Cliente');


// Configuracion de Multer para almacenar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Aquí es donde multer almacenará las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });


// Obtener todas las motos
router.get('/listar', async (req, res) => {
    try {
        console.log("Iniciando solicitud para listar motos...");
        const motos = await Moto.findAll({
            include: {
                model: Cliente,
                attributes: ['nombre', 'telefono', 'direccion'] // Incluyendo los atributos que necesitamos del cliente
            }
        });
        console.log("Motos encontradas:", motos);
        res.json(motos);
    } catch (error) {
        console.error("Error al obtener motos:", error.message); // Mostrar el mensaje específico del error
        console.error("Detalles del error:", error); // Mostrar más detalles del error
        res.status(500).json({ error: "Error al obtener motos" });
    }
});


// Obtener una moto por ID (cambiar esta parte)
router.get('/listar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const moto = await Moto.findByPk(id);
        if (!moto) {
            return res.status(404).json({ error: 'Moto no encontrada' });
        }
        res.json(moto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la moto' });
    }
});

router.post('/crear', upload.fields([
    { name: 'foto_tablero', maxCount: 1 },
    { name: 'foto_angulo_delantero', maxCount: 1 },
    { name: 'foto_angulo_trasero', maxCount: 1 },
    { name: 'foto_lateral_izquierda', maxCount: 1 },
    { name: 'foto_lateral_derecha', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id_cliente, marca, modelo, año, cilindraje, kilometraje, motor, chasis, placa, tipo_servicio, fecha_venta, numero_factura } = req.body;
        const fotos = req.files;

        const moto = await Moto.create({
            id_cliente,
            marca,
            modelo,
            año,
            cilindraje,
            kilometraje,
            motor,
            chasis,
            placa,
            tipo_servicio,
            fecha_venta,
            numero_factura,
            foto_tablero: fotos.foto_tablero ? `/uploads/${fotos.foto_tablero[0].filename}` : null,
            foto_angulo_delantero: fotos.foto_angulo_delantero ? `/uploads/${fotos.foto_angulo_delantero[0].filename}` : null,
            foto_angulo_trasero: fotos.foto_angulo_trasero ? `/uploads/${fotos.foto_angulo_trasero[0].filename}` : null,
            foto_lateral_izquierda: fotos.foto_lateral_izquierda ? `/uploads/${fotos.foto_lateral_izquierda[0].filename}` : null,
            foto_lateral_derecha: fotos.foto_lateral_derecha ? `/uploads/${fotos.foto_lateral_derecha[0].filename}` : null,
        });

        res.json(moto);
    } catch (error) {
        console.error('Error al crear moto:', error);
        res.status(500).json({ error: 'Error al crear moto' });
    }
});


// Actualizar una moto por ID
router.put('/actualizar/:id', upload.fields([
    { name: 'foto_tablero', maxCount: 1 },
    { name: 'foto_angulo_delantero', maxCount: 1 },
    { name: 'foto_angulo_trasero', maxCount: 1 },
    { name: 'foto_lateral_izquierda', maxCount: 1 },
    { name: 'foto_lateral_derecha', maxCount: 1 },
  ]), async (req, res) => {
    try {
      const { id } = req.params;
      const moto = await Moto.findByPk(id);
      if (!moto) {
        return res.status(404).json({ error: 'Moto no encontrada' });
      }
  
      const fotos = req.files;
  
      // Actualizar los campos de la moto
      const updatedData = {
        ...req.body,
        foto_tablero: fotos.foto_tablero ? `/uploads/${fotos.foto_tablero[0].filename}` : moto.foto_tablero,
        foto_angulo_delantero: fotos.foto_angulo_delantero ? `/uploads/${fotos.foto_angulo_delantero[0].filename}` : moto.foto_angulo_delantero,
        foto_angulo_trasero: fotos.foto_angulo_trasero ? `/uploads/${fotos.foto_angulo_trasero[0].filename}` : moto.foto_angulo_trasero,
        foto_lateral_izquierda: fotos.foto_lateral_izquierda ? `/uploads/${fotos.foto_lateral_izquierda[0].filename}` : moto.foto_lateral_izquierda,
        foto_lateral_derecha: fotos.foto_lateral_derecha ? `/uploads/${fotos.foto_lateral_derecha[0].filename}` : moto.foto_lateral_derecha,
      };
  
      await moto.update(updatedData);
      res.json(moto);
    } catch (error) {
      console.error('Error al actualizar la moto:', error);
      res.status(500).json({ error: 'Error al actualizar la moto' });
    }
  });

// Eliminar una moto por ID
router.delete('/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const moto = await Moto.findByPk(id);
        if (!moto) {
            return res.status(404).json({ error: 'Moto no encontrada' });
        }

        await moto.destroy();
        res.json({ message: 'Moto eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la moto' });
    }
});

module.exports = router;

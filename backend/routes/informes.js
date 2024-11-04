// Archivo: informes.js

const express = require('express');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const Moto = require('../models/Moto');
const Inventario = require('../models/Inventario');
const OrdenTrabajo = require('../models/OrdenTrabajo');
const { verificarToken } = require('../auth/middleware');

// Ruta para generar informes (POST)
router.post('/generar', async (req, res) => {
  try {
    const { tipoInforme } = req.body;

    let contenidoHTML = '';
    switch (tipoInforme) {
      case 'Usuarios':
        const usuarios = await Usuario.findAll();
        contenidoHTML = '<h1>Informe de Usuarios</h1>';
        usuarios.forEach((usuario, index) => {
          contenidoHTML += `<p>${index + 1}. Nombre: ${usuario.nombre}, Rol: ${usuario.rol}, Correo: ${usuario.correo}</p>`;
        });
        break;
      case 'Clientes':
        const clientes = await Cliente.findAll();
        contenidoHTML = '<h1>Informe de Clientes</h1>';
        clientes.forEach((cliente, index) => {
          contenidoHTML += `<p>${index + 1}. Nombre: ${cliente.nombre}, Teléfono: ${cliente.telefono}, Dirección: ${cliente.direccion}</p>`;
        });
        break;
      case 'Motos':
        const motos = await Moto.findAll({ include: { model: Cliente, as: 'Cliente', attributes: ['nombre'] } });
        contenidoHTML = '<h1>Informe de Motos</h1>';
        motos.forEach((moto, index) => {
          const clienteNombre = moto.Cliente ? moto.Cliente.nombre : 'Sin asignar';
          contenidoHTML += `<p>${index + 1}. Marca: ${moto.marca}, Modelo: ${moto.modelo}, Año: ${moto.año}, Cliente: ${clienteNombre}</p>`;
        });
        break;
      case 'Inventario':
        const productos = await Inventario.findAll();
        contenidoHTML = '<h1>Informe de Inventario</h1>';
        productos.forEach((producto, index) => {
          contenidoHTML += `<p>${index + 1}. Producto: ${producto.nombre_producto}, Cantidad: ${producto.cantidad_stock}, Precio: ${producto.precio}</p>`;
        });
        break;
      case 'OrdenesTrabajo':
        const ordenes = await OrdenTrabajo.findAll({ include: { model: Moto, as: 'moto', attributes: ['marca', 'modelo'] } });
        contenidoHTML = '<h1>Informe de Órdenes de Trabajo</h1>';
        ordenes.forEach((orden, index) => {
          const motoInfo = orden.moto ? `${orden.moto.marca} ${orden.moto.modelo}` : 'Sin asignar';
          contenidoHTML += `<p>${index + 1}. Orden ID: ${orden.id_orden}, Moto: ${motoInfo}, Estado: ${orden.estado}</p>`;
        });
        break;
      default:
        return res.status(400).json({ error: 'Tipo de informe no válido' });
    }

    // Opciones de configuración de PDF
    const options = { format: 'Letter' };

    // Ruta para guardar el PDF en el servidor
    const filePath = path.join(__dirname, '../public/informes', `informe_${tipoInforme.toLowerCase()}_${Date.now()}.pdf`);

    // Generar PDF a partir del contenido HTML y guardarlo en el servidor
    pdf.create(contenidoHTML, options).toFile(filePath, (err, result) => {
      if (err) {
        console.error('Error al crear el PDF:', err);
        return res.status(500).json({ error: 'Error al generar el informe', detalles: err.message });
      }

      // Confirmar la ruta en la consola
      console.log('PDF generado en:', result.filename);

      // Descargar el archivo PDF generado al cliente
      res.download(result.filename, `informe_${tipoInforme.toLowerCase()}.pdf`, (err) => {
        if (err) {
          console.error('Error al descargar el archivo:', err);
          res.status(500).json({ error: 'Error al descargar el archivo' });
        } else {
          console.log('Archivo descargado exitosamente');
        }
      });
    });
  } catch (error) {
    console.error('Error al generar el informe:', error);
    res.status(500).json({ error: 'Error al generar el informe', detalles: error.message });
  }
});

module.exports = router;

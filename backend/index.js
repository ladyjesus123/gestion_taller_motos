const express = require('express');
const path = require('path'); // Importar el path
const cors = require('cors'); // Importar cors
const sequelize = require('./config/database');
const authRoutes = require('./auth/auth');
require('./init');

const usuariosRoutes = require('./routes/usuarios');
const inspeccionRecepcionRoutes = require('./routes/inspeccionRecepcion');
const motosRoutes = require('./routes/motos');
const clientesRoutes = require('./routes/clientes');
const ordenesTrabajoRoutes = require('./routes/ordenesTrabajo');
const inventarioRoutes = require('./routes/inventario');
const reportesMecanicoRoutes = require('./routes/reportes_mecanico');
const repuestosSolicitadosRoutes = require('./routes/repuestos_solicitados');
const alertasRoutes = require('./routes/alertas');

const app = express();
app.use(express.json());
app.use(cors()); // Habilitar CORS para todas las solicitudes

// Usar la carpeta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ajustar prefijos para evitar conflictos 
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/inspeccionRecepcion', inspeccionRecepcionRoutes);
app.use('/api/motos', motosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ordenesTrabajo', ordenesTrabajoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/reportes_mecanico', reportesMecanicoRoutes);
app.use('/api/repuestos_solicitados', repuestosSolicitadosRoutes);
app.use('/api/alertas', alertasRoutes);

// Sincronizar base de datos y correr el servidor
sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
    app.listen(4000, () => {
        console.log('Servidor corriendo en el puerto 4000');
    });
}).catch(err => console.log('Error al sincronizar la base de datos:', err));

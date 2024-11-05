require('dotenv').config();
const PORT = process.env.PORT || 4000;//definir el puerto por defecto 4000 si no que render use otro el que el quiera
const cors = require('cors'); // Importar cors
const express = require('express');// Importar express
const path = require('path'); // Importar el path
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
const informesRouter = require('./routes/informes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://ladyjesus123.github.io', // URL de GitHub Pages
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })); // Habilitar CORS para todas las solicitudes

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
app.use('/api/informes', informesRouter);

// Sincronizar base de datos y correr el servidor
sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => console.log('Error al sincronizar la base de datos:', err));

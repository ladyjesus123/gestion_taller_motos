const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const path = require('path');
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

const allowedOrigins = [
  'http://localhost:5173',
  'https://gestion-taller-motos.onrender.com' // URL del frontend desplegado en render
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Permitir solicitudes OPTIONS para todas las rutas
app.options('*', cors());

// Usar la carpeta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definir rutas de API
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

// Servir archivos estáticos del frontend desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// para rutas que no son correctas
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});

// Sincronizar base de datos y correr el servidor
sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => console.log('Error al sincronizar la base de datos:', err));

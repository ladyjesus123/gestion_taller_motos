const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id_cliente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(15),
  },
  direccion: {
    type: DataTypes.TEXT,
  },
  nit: {
    type: DataTypes.STRING(20),
    unique: true,
  },
}, {
  tableName: 'clientes',
  timestamps: false, 
});

module.exports = Cliente;



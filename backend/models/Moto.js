// Archivo: Moto.js (Modelo)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');

const Moto = sequelize.define('Moto', {
    id_moto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    año: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cilindraje: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    kilometraje: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    motor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    chasis: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    placa: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    tipo_servicio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_venta: {
        type: DataTypes.DATE,
        allowNull: true
    },
    numero_factura: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_tablero: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_angulo_delantero: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_angulo_trasero: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_lateral_izquierda: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_lateral_derecha: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'motos',
    timestamps: true
});

Cliente.hasMany(Moto, { foreignKey: 'id_cliente' });
Moto.belongsTo(Cliente, { foreignKey: 'id_cliente' });

module.exports = Moto;
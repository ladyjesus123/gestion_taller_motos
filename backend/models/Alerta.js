const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Moto = require('./Moto');
const Cliente = require('./Cliente');

const Alerta = sequelize.define('Alerta', {
    id_alerta: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_moto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Moto,
            key: 'id_moto',
        },
        onDelete: 'CASCADE',
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: 'id_cliente',
        },
        onDelete: 'CASCADE',
    },
    tipo_alerta: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    fecha_alerta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activa',
        allowNull: true,
    },
}, {
    tableName: 'alertas',
    timestamps: false,
});

// Asociaciones
Moto.hasMany(Alerta, { foreignKey: 'id_moto' });
Alerta.belongsTo(Moto, { foreignKey: 'id_moto', as: 'moto' });

Cliente.hasMany(Alerta, { foreignKey: 'id_cliente' });
Alerta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

module.exports = Alerta;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Moto = require('./Moto');
const Usuario = require('./Usuario');

const InspeccionRecepcion = sequelize.define('InspeccionRecepcion', {
    id_inspeccion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_moto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Moto,
            key: 'id_moto'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'Pendiente',
        allowNull: false
    },
    id_mecanico_asignado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'id_usuario'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    id_vendedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    foto_moto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    inventario: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    nivel_gasolina: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nivel_aceite: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'inspeccion_recepcion',
    timestamps: true
});

// Asociaciones
Moto.hasMany(InspeccionRecepcion, { foreignKey: 'id_moto' });
InspeccionRecepcion.belongsTo(Moto, { foreignKey: 'id_moto' , as: 'moto' });

Usuario.hasMany(InspeccionRecepcion, { foreignKey: 'id_mecanico_asignado', as: 'inspecciones' });
InspeccionRecepcion.belongsTo(Usuario, { foreignKey: 'id_mecanico_asignado', as: 'mecanico' });

Usuario.hasMany(InspeccionRecepcion, { foreignKey: 'id_vendedor', as: 'inspecciones_vendedor' });
InspeccionRecepcion.belongsTo(Usuario, { foreignKey: 'id_vendedor', as: 'vendedor' });

module.exports = InspeccionRecepcion;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const OrdenTrabajo = require('./OrdenTrabajo');
const Inventario = require('./Inventario');

const RepuestoSolicitado = sequelize.define('RepuestoSolicitado', {
    id_solicitud: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: OrdenTrabajo,
            key: 'id_orden',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Inventario,
            key: 'id_producto',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1
        },
    },
    estado_autorizacion: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendiente',
        allowNull: true,
        validate: {
            isIn: [['pendiente', 'autorizado', 'no_autorizado']]
        }
    },
}, {
    tableName: 'repuestos_solicitados',
    timestamps: true,
});

// Asociaciones
OrdenTrabajo.hasMany(RepuestoSolicitado, { foreignKey: 'id_orden' });
RepuestoSolicitado.belongsTo(OrdenTrabajo, { foreignKey: 'id_orden', as: 'ordenTrabajo' });

Inventario.hasMany(RepuestoSolicitado, { foreignKey: 'id_producto' });
RepuestoSolicitado.belongsTo(Inventario, { foreignKey: 'id_producto', as: 'producto' });

module.exports = RepuestoSolicitado;

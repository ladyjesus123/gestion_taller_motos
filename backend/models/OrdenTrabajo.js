const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Moto = require('./Moto');
const Usuario = require('./Usuario');
const InspeccionRecepcion = require('./InspeccionRecepcion');

const OrdenTrabajo = sequelize.define('OrdenTrabajo', {
    id_orden: {
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
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },
    id_inspeccion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: InspeccionRecepcion,
            key: 'id_inspeccion'
        }
    },
    tipo_servicio: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'abierta',
        allowNull: true
    },
    detalle_inspeccion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'ordenes_trabajo',
    timestamps: true
});

// Asociaciones
// Moto -> OrdenTrabajo (1 a Muchos)
// Moto -> OrdenTrabajo (1 a Muchos)
Moto.hasMany(OrdenTrabajo, { foreignKey: 'id_moto', as: 'ordenesTrabajo' });
OrdenTrabajo.belongsTo(Moto, { foreignKey: 'id_moto', as: 'moto' });


// Usuario -> OrdenTrabajo (1 a Muchos)
Usuario.hasMany(OrdenTrabajo, { foreignKey: 'id_usuario', as: 'ordenesTrabajoUsuario' });
OrdenTrabajo.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// InspeccionRecepcion -> OrdenTrabajo (1 a 1)
InspeccionRecepcion.hasOne(OrdenTrabajo, { foreignKey: 'id_inspeccion', as: 'ordenTrabajo' });
OrdenTrabajo.belongsTo(InspeccionRecepcion, { foreignKey: 'id_inspeccion', as: 'inspeccion' });

module.exports = OrdenTrabajo;

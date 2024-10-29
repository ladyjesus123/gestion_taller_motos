const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const OrdenTrabajo = require('./OrdenTrabajo');
const Usuario = require('./Usuario');

const ReporteMecanico = sequelize.define('ReporteMecanico', {
    id_reporte: {
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
    id_mecanico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    diagnostico_inicial: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    procesos_realizados: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    fecha_hora_recepcion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    fecha_hora_entrega: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    costo_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    observaciones_finales: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'reportes_mecanico',
    timestamps: true, // Para agregar createdAt y updatedAt automáticamente
});

// Asociaciones
OrdenTrabajo.hasMany(ReporteMecanico, { foreignKey: 'id_orden' });
ReporteMecanico.belongsTo(OrdenTrabajo, { foreignKey: 'id_orden', as: 'ordenTrabajo' });

Usuario.hasMany(ReporteMecanico, { foreignKey: 'id_mecanico' });
ReporteMecanico.belongsTo(Usuario, { foreignKey: 'id_mecanico', as: 'mecanico' });

module.exports = ReporteMecanico;
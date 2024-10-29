const { DataTypes } = require('sequelize'); 
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false, // Contraseña cifrada (hash)
    },
    contraseña_visible: {
        type: DataTypes.STRING,
        allowNull: true, // Contraseña en texto plano (solo para pruebas)
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Asegúrate de tener un valor predeterminado
    }
},


{
    tableName: 'usuarios',
    timestamps: true,
});

module.exports = Usuario;

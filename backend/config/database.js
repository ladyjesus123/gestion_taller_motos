const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('gestion_taller', 'taller_user', 'L4d1@1111', {
  host: 'dpg-csklmbl6l47c73bljocg-a.oregon-postgres.render.com',
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});


module.exports = sequelize;

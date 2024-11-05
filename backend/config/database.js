require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gestion_taller', 'taller_user', 'KBLLgXO3YKwsWeqKZNB9D2Vi1SMLKSlC', {
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

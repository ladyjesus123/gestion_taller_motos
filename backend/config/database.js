const sequelize = new Sequelize('gestion_taller', 'taller_user', 'NUEVA_CONTRASEÑA', {
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

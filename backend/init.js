const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario'); // Asegúrate de que la ruta sea correcta según tu estructura

async function crearAdministradorInicial() {
  try {
    // Buscar si ya existe un administrador
    const administradorExistente = await Usuario.findOne({ where: { rol: 'Administrador' } });

    if (!administradorExistente) {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Crear el administrador inicial
      await Usuario.create({
        nombre: 'Administrador',
        rol: 'Administrador',
        correo: 'admin@taller.com',
        contraseña: hashedPassword,
        contraseña_visible: 'admin123', // Solo para la fase de pruebas
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Usuario administrador inicial creado.');
    } else {
      console.log('El usuario administrador ya existe.');
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador inicial:', error);
  }
}

crearAdministradorInicial();

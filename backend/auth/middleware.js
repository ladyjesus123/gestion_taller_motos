const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ error: 'No se proporcionó un token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'No se proporcionó un token válido' });
  }

  try {
    const payload = jwt.verify(token, 'clave_secreta');
    if (payload.activo === false) {
      return res.status(403).json({ error: 'Usuario inactivo. Acceso denegado.' });
    }
    req.usuario = payload;
    next(); // Continuar con la siguiente función del middleware o ruta
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Middleware para verificar el rol del usuario
function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
    }
    next();
  };
}

module.exports = { verificarToken, verificarRol };

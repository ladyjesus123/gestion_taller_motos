import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [usuario, setUsuario] = useState({
    correo: '',
    contraseña: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, {
        correo: usuario.correo,
        contraseña: usuario.contraseña,
      });
  
      console.log(response.data); // Agrega esto para ver la respuesta del servidor
  
      const { token } = response.data;
      localStorage.setItem('token', token);
      window.location.href = '/home';
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      alert('Usuario inactivo o credenciales incorrectas');
    }
  };
  
  
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Correo:</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              value={usuario.correo}
              onChange={handleInputChange}
              placeholder="Correo Electrónico"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Contraseña:</label>
            <input
              type="password"
              name="contraseña"
              className="form-control"
              value={usuario.contraseña}
              onChange={handleInputChange}
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

// src/pages/EditarUsuario.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditarUsuario = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    id_usuario: '',
    nombre: '',
    correo: '',
    rol: '',
    activo: 'true',
  });
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    if (state && state.usuario) {
      setUsuario(state.usuario);
    } else {
      navigate('/usuarios'); // Redirigir si no hay usuario en el estado
    }
  }, [state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleUpdateUsuario = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:4000/api/usuarios/${usuario.id_usuario}`, usuario, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensajeError('');
      navigate('/usuarios'); // Redirigir a la lista de usuarios después de actualizar
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setMensajeError('Error al actualizar el usuario. Verifica los datos e intenta nuevamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Editar Usuario</h2>
      {mensajeError && (
        <div className="alert alert-danger" role="alert">
          {mensajeError}
        </div>
      )}
      <form onSubmit={handleUpdateUsuario} className="mb-4">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Nombre del usuario"
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              name="correo"
              value={usuario.correo}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Correo electrónico"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <select
              name="rol"
              value={usuario.rol}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="vendedor">Vendedor</option>
              <option value="mecanico">Mecánico</option>
            </select>
          </div>
          <div className="col">
            <select
              name="activo"
              value={usuario.activo}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Usuario</button>
      </form>
    </div>
  );
};

export default EditarUsuario;

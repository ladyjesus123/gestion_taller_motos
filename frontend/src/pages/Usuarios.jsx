import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', correo: '', contraseña: '', rol: '', activo: 'true' });
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(''); // Estado para el rol del usuario actual

  useEffect(() => {
    // Obtener todos los usuarios si el usuario actual es Administrador
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUserRole(decodedToken.rol);
          if (decodedToken.rol === 'Administrador') {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(response.data);
          }
        }
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/inicial`, nuevoUsuario, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNuevoUsuario({ nombre: '', correo: '', contraseña: '', rol: '', activo: 'true' });
      window.location.reload(); // Recargar la página para ver el nuevo usuario
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
    }
  };

  const handleDeleteUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }
  };

  const handleEditUsuario = (usuario) => {
    navigate(`/editar-usuario/${usuario.id_usuario}`, { state: { usuario } });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Usuarios</h2>
      {userRole === 'Administrador' && (
        <>
          {/* Formulario para agregar un nuevo usuario */}
          <form onSubmit={handleAddUsuario} className="mb-4">
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  name="nombre"
                  value={nuevoUsuario.nombre}
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
                  value={nuevoUsuario.correo}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="password"
                  name="contraseña"
                  value={nuevoUsuario.contraseña}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Contraseña"
                  required
                />
              </div>
              <div className="col">
                <select
                  name="rol"
                  value={nuevoUsuario.rol}
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
            </div>
            <button type="submit" className="btn btn-primary">Agregar Usuario</button>
          </form>

          {/* Tabla de usuarios */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th> {/* Índice para numerar los usuarios */}
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id_usuario}>
                  <td>{index + 1}</td> {/* Mostrar número continuo usando el índice */}
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.rol}</td>
                  <td>{usuario.activo ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    {userRole === 'Administrador' && usuario.rol !== 'Administrador' && (
                      <>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEditUsuario(usuario)}
                        >
                          Editar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {userRole !== 'Administrador' && (
        <p className="text-center">No tienes permisos para gestionar usuarios.</p>
      )}
    </div>
  );
};

export default Usuarios;

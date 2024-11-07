import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', telefono: '', direccion: '', nit: '' });
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(''); // Estado para el rol del usuario

  useEffect(() => {
    // Obtener todos los clientes (GET)
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`);
        setClientes(response.data);
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
      }
    };
    fetchClientes();

    // Obtener el rol del usuario desde el localStorage o JWT
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.rol);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleAddCliente = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/clientes`, nuevoCliente);
      setClientes([...clientes, response.data]);
      setNuevoCliente({ nombre: '', telefono: '', direccion: '', nit: '' });
    } catch (error) {
      console.error('Error al agregar el cliente:', error);
    }
  };

  const handleDeleteCliente = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/clientes/${id}`);
        setClientes(clientes.filter((cliente) => cliente.id_cliente !== id));
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      }
    }
  };

  const handleEditCliente = (cliente) => {
    navigate(`/editar-cliente/${cliente.id_cliente}`, { state: { cliente } });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Clientes</h2>

      {/* Formulario para agregar un nuevo cliente */}
      <form onSubmit={handleAddCliente} className="mb-4">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="nombre"
              value={nuevoCliente.nombre}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Nombre del cliente"
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="telefono"
              value={nuevoCliente.telefono}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Teléfono"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="direccion"
              value={nuevoCliente.direccion}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Dirección"
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="nit"
              value={nuevoCliente.nit}
              onChange={handleInputChange}
              className="form-control"
              placeholder="NIT"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Agregar Cliente</button>
      </form>

      {/* Tabla de clientes */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>NIT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={cliente.id_cliente}>
              <td>{index + 1}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.nit}</td>
              <td>
                {userRole === 'Administrador' && (
                  <>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDeleteCliente(cliente.id_cliente)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditCliente(cliente)}
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
    </div>
  );
};

export default Clientes;

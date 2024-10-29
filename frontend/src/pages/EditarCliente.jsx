// src/pages/EditarCliente.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditarCliente = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cliente } = location.state;

  const [clienteEditado, setClienteEditado] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    nit: '',
  });

  useEffect(() => {
    if (cliente) {
      setClienteEditado(cliente);
    }
  }, [cliente]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteEditado({ ...clienteEditado, [name]: value });
  };

  const handleUpdateCliente = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/clientes/${clienteEditado.id_cliente}`, clienteEditado);
      navigate('/clientes');
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Editar Cliente</h2>
      <form onSubmit={handleUpdateCliente}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="nombre"
              value={clienteEditado.nombre}
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
              value={clienteEditado.telefono}
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
              value={clienteEditado.direccion}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Dirección"
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="nit"
              value={clienteEditado.nit}
              onChange={handleInputChange}
              className="form-control"
              placeholder="NIT"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success">Guardar Cambios</button>
        <button type="button" className="btn btn-secondary ms-3" onClick={() => navigate('/clientes')}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditarCliente;

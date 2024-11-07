import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditarMoto = () => {
  const { state } = useLocation();
  const { moto } = state;
  const navigate = useNavigate();

  const [motoData, setMotoData] = useState({
    id_moto: moto?.id_moto || '',
    id_cliente: moto?.id_cliente || '',
    marca: moto?.marca || '',
    modelo: moto?.modelo || '',
    año: moto?.año || '',
    cilindraje: moto?.cilindraje || '',
    kilometraje: moto?.kilometraje || '',
    motor: moto?.motor || '',
    chasis: moto?.chasis || '',
    placa: moto?.placa || '',
    tipo_servicio: moto?.tipo_servicio || '',
    fecha_venta: moto?.fecha_venta || '',
    numero_factura: moto?.numero_factura || '',
    fotos: {},
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMotoData({ ...motoData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setMotoData({ ...motoData, fotos: { ...motoData.fotos, [name]: files[0] } });
  };

  const handleUpdateMoto = async (e) => {
    e.preventDefault();

    const confirmUpdate = window.confirm('¿Estás seguro de que deseas actualizar los datos de esta moto?');
if (!confirmUpdate) {
  return; // Detener la ejecución si el usuario cancela
}


    if (!motoData.id_moto) {
      console.error("ID de la moto es indefinido, no se puede actualizar");
      return;
    }
    try {
      const formData = new FormData();
      Object.keys(motoData).forEach((key) => {
        if (key === 'fotos') {
          Object.keys(motoData.fotos).forEach((fotoKey) => {
            if (motoData.fotos[fotoKey]) {
              formData.append(fotoKey, motoData.fotos[fotoKey]);
            }
          });
        } else {
          formData.append(key, motoData[key] || '');
        }
      });
  
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/motos/actualizar/${motoData.id_moto}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      navigate('/motos');
    } catch (error) {
      console.error('Error al actualizar la moto:', error);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Editar Moto</h2>
      <form onSubmit={handleUpdateMoto} className="mb-4">
        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="marca">Marca:</label>
            <input
              type="text"
              name="marca"
              value={motoData.marca || ''}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="modelo">Modelo:</label>
            <input
              type="text"
              name="modelo"
              value={motoData.modelo || ''}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="año">Año:</label>
            <input
              type="number"
              name="año"
              value={motoData.año || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="cilindraje">Cilindraje:</label>
            <input
              type="number"
              name="cilindraje"
              value={motoData.cilindraje || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="kilometraje">Kilometraje:</label>
            <input
              type="number"
              name="kilometraje"
              value={motoData.kilometraje || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="motor">Motor:</label>
            <input
              type="text"
              name="motor"
              value={motoData.motor}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="chasis">Chasis:</label>
            <input
              type="text"
              name="chasis"
              value={motoData.chasis}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="placa">Placa:</label>
            <input
              type="text"
              name="placa"
              value={motoData.placa || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="tipo_servicio">Tipo de Servicio:</label>
            <select
              name="tipo_servicio"
              value={motoData.tipo_servicio || ''}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="Nuevo servicio">Nuevo servicio</option>
              <option value="Primer servicio">Primer servicio</option>
              <option value="Servicio menor">Servicio menor</option>
              <option value="Servicio mayor">Servicio mayor</option>
              <option value="Servicio de reparación">Servicio de reparación</option>
              <option value="Servicio de revisión">Servicio de revisión</option>
            </select>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="fecha_venta">Fecha de Venta:</label>
            <input
              type="date"
              name="fecha_venta"
              value={motoData.fecha_venta || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="numero_factura">Número de Factura:</label>
            <input
              type="text"
              name="numero_factura"
              value={motoData.numero_factura || ''} 
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label>Foto del Tablero:</label>
            <input
              type="file"
              name="foto_tablero"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label>Foto Ángulo Delantero:</label>
            <input
              type="file"
              name="foto_angulo_delantero"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label>Foto Ángulo Trasero:</label>
            <input
              type="file"
              name="foto_angulo_trasero"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label>Foto Lateral Izquierda:</label>
            <input
              type="file"
              name="foto_lateral_izquierda"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-3">
            <label>Foto Lateral Derecha:</label>
            <input
              type="file"
              name="foto_lateral_derecha"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Actualizar Moto</button>
        <button type="button" className="btn btn-secondary ms-3" onClick={() => navigate('/motos')}>
          Volver a Motos
        </button>
      </form>
    </div>
  );
};

export default EditarMoto;

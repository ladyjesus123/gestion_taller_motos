import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const CrearMoto = () => {
  const [nuevaMoto, setNuevaMoto] = useState({
    id_cliente: '',
    marca: '',
    modelo: '',
    año: '',
    cilindraje: '',
    kilometraje: '',
    motor: '',
    chasis: '',
    placa: '',
    tipo_servicio: 'Nuevo servicio',
    fecha_venta: '',
    numero_factura: '',
    fotos: {}
  });

  const [clientes, setClientes] = useState([]);

  const navigate = useNavigate();

   useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const responseClientes = await axios.get('http://localhost:4000/api/clientes', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClientes(responseClientes.data);
        }
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
      }
    };
    fetchClientes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaMoto({
      ...nuevaMoto,
      [name]: name === 'año' ? parseInt(value, 10) : value,
    });
  };
  

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNuevaMoto({ ...nuevaMoto, fotos: { ...nuevaMoto.fotos, [name]: files[0] } });
  };

  const handleAddMoto = async (e) => {
    e.preventDefault();
    if (nuevaMoto.id_cliente === 'crear_nuevo') {
      navigate('/clientes');
      return;
    }
    try {
      const formData = new FormData();
      Object.keys(nuevaMoto).forEach((key) => {
        if (key === 'fotos') {
          Object.keys(nuevaMoto.fotos).forEach((fotoKey) => {
            formData.append(fotoKey, nuevaMoto.fotos[fotoKey]);
          });
        } else {
          formData.append(key, nuevaMoto[key]);
        }
      });

      console.log("Datos a enviar:", nuevaMoto); // Verificar los datos antes de enviarlos al backend


      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/motos/crear', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setNuevaMoto({
        id_cliente: '',
        marca: '',
        modelo: '',
        año: '',
        cilindraje: '',
        kilometraje: '',
        motor: '',
        chasis: '',
        placa: '',
        tipo_servicio: 'Nuevo servicio',
        fecha_venta: '',
        numero_factura: '',
        fotos: {}
      });
      navigate('/motos'); // Regresar a la página de motos después de crear una nueva moto
    } catch (error) {
      console.error('Error al agregar la moto:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Agregar Nueva Moto</h2>
        {/* Formulario para agregar una nueva moto */}
        <form onSubmit={handleAddMoto} className="mb-4">
            <div className="row mb-3">
              <div className="col">
              <label htmlFor="Cliente" className="text-start">Cliente:</label>
                              <select
                  name="id_cliente"
                  value={nuevaMoto.id_cliente}
                  onChange={(e) => {
                    if (e.target.value === 'crear_nuevo') {
                      navigate('/clientes');
                    } else {
                      handleInputChange(e);
                    }
                  }}
                  className="form-control"
                  required
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre}
                    </option>
                  ))}
                  <option value="crear_nuevo">Crear nuevo cliente</option>
                </select>

              </div>
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="Marca" className="text-start">Marca:</label>
                <input
                  type="text"
                  name="marca"
                  value={nuevaMoto.marca}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="Modelo" className="text-start">Modelo:</label>
                <input
                  type="text"
                  name="modelo"
                  value={nuevaMoto.modelo}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="año" className="text-start">Año:</label>
                <select
                    id="año"
                    name="año"
                    value={nuevaMoto.año}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    >
                    <option value="">Selecciona un año</option>
                    {Array.from({ length: 50 }, (_, index) => {
                    const year = new Date().getFullYear() - index;
                    return (
                        <option key={year} value={year}>
                        {year}
                        </option>
                    );
                    })}
                </select>
                </div>

            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="Cilindraje" className="text-start">Cilindraje:</label>
                <input
                  type="number"
                  name="cilindraje"
                  value={nuevaMoto.cilindraje}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="Kilometraje" className="text-start">Kilometraje:</label>
                <input
                  type="number"
                  name="kilometraje"
                  value={nuevaMoto.kilometraje}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="Motor" className="text-start">Motor:</label>
                <input
                  type="text"
                  name="motor"
                  value={nuevaMoto.motor}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="Chasis" className="text-start">Chasis:</label>
                <input
                  type="text"
                  name="chasis"
                  value={nuevaMoto.chasis}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="Placa" className="text-start">Placa:</label>
                <input
                  type="text"
                  name="placa"
                  value={nuevaMoto.placa}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="servicio" className="text-start">Tipo de Servicio:</label>
                <select
                  name="tipo_servicio"
                  value={nuevaMoto.tipo_servicio}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Nuevo servicio" >Nuevo servicio</option>
                  <option value="Primer servicio">Primer servicio</option>
                  <option value="Servicio menor">Servicio menor</option>
                  <option value="Servicio mayor">Servicio mayor</option>
                  <option value="Servicio de reparación">Servicio de reparación</option>
                  <option value="Servicio de revisión">Servicio de revisión</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="fecha_venta" className="text-start">Fecha de Venta:</label>
              <input
                type="date"
                id="fecha_venta"
                name="fecha_venta"
                value={nuevaMoto.fecha_venta}
                onChange={handleInputChange}
                className="form-control"
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
              <label htmlFor="factura" className="text-start">Número de Factura:</label>
                <input
                  type="text"
                  name="numero_factura"
                  value={nuevaMoto.numero_factura}
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
              <div className="col-12 col-md-6 mb-3">
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                    Agregar Moto
                </button>
                <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/motos')}
                >
                    Volver a Motos
                </button>
                </div>

              </div>
            </div>
        </form>
    </div>
  );
};

export default CrearMoto;

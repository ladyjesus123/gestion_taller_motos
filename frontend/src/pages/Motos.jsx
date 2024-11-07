import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Motos = () => {
  const [motos, setMotos] = useState([]);
  const [clientes, setClientes] = useState([]);
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
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [showModal, setShowModal] = useState(false); // Para manejar si el modal está abierto o no
  const [selectedImage, setSelectedImage] = useState(''); // Para almacenar la URL de la imagen seleccionada


  useEffect(() => {
    const fetchMotos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUserRole(decodedToken.rol);

          const responseMotos = await axios.get(`${import.meta.env.VITE_API_URL}/api/motos/listar`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMotos(responseMotos.data);

          const responseClientes = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClientes(responseClientes.data);
        }
      } catch (error) {
        console.error('Error al cargar las motos o clientes:', error);
      }
    };
    fetchMotos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaMoto({ ...nuevaMoto, [name]: value });
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

      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/motos/crear`, formData, {
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
      window.location.reload();
    } catch (error) {
      console.error('Error al agregar la moto:', error);
    }
  };

  const handleEditMoto = (moto) => {
    navigate(`/editar-moto/${moto.id_moto}`, { state: { moto } });
  };
  

  const handleDeleteMoto = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta moto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/motos/eliminar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMotos(motos.filter((moto) => moto.id_moto !== id));
      } catch (error) {
        console.error('Error al eliminar la moto:', error);
      }
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Guarda la URL de la imagen seleccionada
    setShowModal(true); // Abre el modal
  };
  
  const closeModal = () => {
    setShowModal(false); // Cierra el modal
    setSelectedImage(''); // Limpia la imagen seleccionada
  };
  
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Motos</h2>
      {userRole === 'Administrador' || userRole === 'vendedor' ? (
        <>
<div className="mb-4">
  <button
    className="btn btn-success"
    onClick={() => navigate('/crear-moto')}
  >
    Agregar Nueva Moto
  </button>
</div>

          {/* Tabla de motos */}
          <table className="table table-bordered table-striped table-hover">
  <thead className="table-dark text-center">
    <tr>
      <th style={{ width: '3%' }}>#</th>
      <th style={{ width: '7%' }}>Marca</th>
      <th style={{ width: '7%' }}>Modelo</th>
      <th style={{ width: '8%' }}>Cilindraje</th>
      <th style={{ width: '8%' }}>Kilometraje</th>
      <th style={{ width: '7%' }}>Motor</th>
      <th style={{ width: '7%' }}>Chasis</th>
      <th style={{ width: '7%' }}>Placa</th>
      <th style={{ width: '7%' }}>Tipo de Servicio</th>
      <th style={{ width: '7%' }}>Propietario</th>
      <th style={{ width: '30%' }}>Fotos</th>
      <th style={{ width: '5%' }}>Acciones</th>
    </tr>
  </thead>
  <tbody className="text-center align-middle">
    {motos.map((moto, index) => (
      <tr key={moto.id_moto}>
        <td>{index + 1}</td>
        <td>{moto.marca}</td>
        <td>{moto.modelo}</td>
        <td>{moto.cilindraje}</td>
        <td>{moto.kilometraje}</td>
        <td>{moto.motor}</td>
        <td>{moto.chasis}</td>
        <td>{moto.placa}</td>
        <td>{moto.tipo_servicio}</td>
        <td>{moto.id_cliente}</td>
        <td>
                {moto.foto_tablero && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${moto.foto_tablero}`}
                    alt="Foto Tablero"
                    style={{ width: '50px', height: '50px', marginRight: '5px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(`${import.meta.env.VITE_API_URL}${moto.foto_tablero}`)}
                  />
                )}
                {moto.foto_angulo_delantero && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${moto.foto_angulo_delantero}`}
                    alt="Foto Ángulo Delantero"
                    style={{ width: '50px', height: '50px', marginRight: '5px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(`${import.meta.env.VITE_API_URL}${moto.foto_angulo_delantero}`)}
                  />
                )}
                {moto.foto_angulo_trasero && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${moto.foto_angulo_trasero}`}
                    alt="Foto Ángulo Trasero"
                    style={{ width: '50px', height: '50px', marginRight: '5px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(`${import.meta.env.VITE_API_URL}${moto.foto_angulo_trasero}`)}
                  />
                )}
                {moto.foto_lateral_izquierda && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${moto.foto_lateral_izquierda}`}
                    alt="Foto Lateral Izquierda"
                    style={{ width: '50px', height: '50px', marginRight: '5px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(`${import.meta.env.VITE_API_URL}${moto.foto_lateral_izquierda}`)}
                  />
                )}
                {moto.foto_lateral_derecha && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${moto.foto_lateral_derecha}`}
                    alt="Foto Lateral Derecha"
                    style={{ width: '50px', height: '50px', marginRight: '5px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(`${import.meta.env.VITE_API_URL}${moto.foto_lateral_derecha}`)}
                  />
                )}
              </td>
              <td>
              <div className="d-flex flex-column gap-2">
            {(userRole === 'Administrador' || userRole === 'vendedor') && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleEditMoto(moto)}
              >
                Editar
              </button>
            )}
            {userRole === 'Administrador' && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteMoto(moto.id_moto)}
              >
                Eliminar
              </button>
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
           {/* Modal para ver la imagen en grande */}
           {showModal && (
            <div className="modal" style={{ display: 'block' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Vista de la Moto</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body text-center">
                    <img src={selectedImage} alt="Imagen Grande" style={{ width: '100%' }} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center">No tienes permisos para gestionar motos.</p>
      )}
    </div>
  );
};

export default Motos;

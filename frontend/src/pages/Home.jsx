import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUsers, faMotorcycle, faClipboardCheck, faWrench, faBox, faFileAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const navigate = useNavigate();

  const modules = [
    { name: 'alertas stock Inventario', path: '/notificaciones', icon: faBell },
    { name: 'Clientes', path: '/clientes', icon: faUsers },
    { name: 'Motos', path: '/motos', icon: faMotorcycle },
    { name: 'Inspección y Recepción', path: '/inspeccion-recepcion/listar', icon: faClipboardCheck },
    { name: 'Órdenes de Trabajo', path: '/ordenesTrabajo', icon: faWrench },
    { name: 'Reportes del Mecánico', path: '/reportes_mecanico/listar', icon: faFileAlt },
    { name: 'Inventario', path: '/inventario', icon: faBox },
    { name: 'Informes', path: '/informes', icon: faFileAlt },
    { name: 'Usuarios', path: '/usuarios', icon: faUserShield },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Página Principal</h2>
      <div className="row">
        {modules.map((module) => (
          <div key={module.name} className="col-md-4 mb-4">
            <div
              className="card h-100"
              style={{
                backgroundColor: '#81c784', // Verde más suave
                color: '#000000', // Texto negro
              }}
            >
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="text-center mb-3">
                  <FontAwesomeIcon 
                    icon={module.icon} 
                    size="3x" 
                    style={{ color: '#e53935' }} // Icono rojo
                  />
                </div>
                <h3 className="card-title text-center" style={{ color: '#000000' }}>{module.name}</h3>
                <button
                  className="btn btn-primary mt-3"
                  style={{ color: '#000000' }}
                  onClick={() => navigate(module.path)}
                >
                  Ir al módulo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

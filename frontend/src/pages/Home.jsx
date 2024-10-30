import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Home.css';
import PanelNotificaciones from './PanelNotificaciones';


const Home = () => {
  const navigate = useNavigate();

  const modules = [
    { name: 'Clientes', path: '/clientes' },
    { name: 'Motos', path: '/motos' },
    { name: 'Inspección y Recepción', path: '/inspeccion-recepcion/listar' },
    { name: 'Órdenes de Trabajo', path: '/ordenesTrabajo' },
    { name: 'Reportes del Mecánico', path: '/reportes_mecanico/listar' },
    { name: 'Inventario', path: '/inventario' },
    { name: 'Informes', path: '/informes' },
    { name: 'Usuarios', path: '/usuarios' },
    { name: 'Notificaciones', path: '/notificaciones' },
    
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Página Principal</h2>
      <div className="row">
        {modules.map((module) => (
          <div key={module.name} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h3 className="card-title">{module.name}</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate(module.path)}>Ir al módulo</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

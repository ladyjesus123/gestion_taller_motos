import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Clientes from './pages/Clientes'; 
import EditarCliente from './pages/EditarCliente';
import Usuarios from './pages/Usuarios'; 
import EditarUsuario from './pages/EditarUsuario';
import Motos from './pages/Motos';
import CrearMoto from './pages/CrearMoto';
import EditarMoto from './pages/EditarMoto';
import InspeccionRecepcion from './pages/InspeccionRecepcion';
import ListaInspecciones from './pages/ListaInspecciones';
import DetalleInspeccion from './pages/DetalleInspeccion';
import EditarInspeccion from './pages/EditarInspeccion';
import ListaOrdenes from './pages/ListaOrdenes';
import CrearOrden from './pages/CrearOrden';
import DetallesOrden from './pages/DetallesOrden';
import ListaProductos from './pages/ListaProductos';
import CrearProducto from './pages/CrearProducto';
import EditarProducto from './pages/EditarProducto';
import CrearReporte from './pages/CrearReporte';
import ListaReportes from './pages/ListaReportes';
import EditarReporte from './pages/EditarReporte';
import DetallesReporte from './pages/DetallesReporte';
import Notificaciones from './pages/PanelNotificaciones';
import PaginaInformes from './pages/PaginaInformes';
import './styles/App.css';


const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Busca el token en el almacenamiento local

    if (!token) {
      navigate('/'); // Si no hay token, redirige al login
    }
  }, [navigate]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/editar-cliente/:id" element={<EditarCliente />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
        <Route path="/motos" element={<Motos />} />
        <Route path="/crear-moto" element={<CrearMoto />} />
        <Route path="/editar-moto/:id" element={<EditarMoto />} />
        <Route path="/inspeccion-recepcion" element={<InspeccionRecepcion />} />
        <Route path="/inspeccion-recepcion/listar" element={<ListaInspecciones />} />
        <Route path="/inspeccion-recepcion/detalles/:id" element={<DetalleInspeccion />} />
        <Route path="/ordenesTrabajo" element={<ListaOrdenes />} />
        <Route path="/ordenesTrabajo/crear" element={<CrearOrden />} />
        <Route path="/ordenesTrabajo/detalles/:id" element={<DetallesOrden />} />
        <Route path="/inspeccion-recepcion/editar/:id" element={<EditarInspeccion />} />
        <Route path="/inventario" element={<ListaProductos />} />
        <Route path="/inventario/crear" element={<CrearProducto />} />
        <Route path="/inventario/editar/:id" element={<EditarProducto />} />
        <Route path="/reportes_mecanico/crear" element={<CrearReporte />} />
        <Route path="/reportes_mecanico/listar" element={<ListaReportes />} />
        <Route path="/reportes_mecanico/editar/:id" element={<EditarReporte />} />
        <Route path="/reportes_mecanico/detalles/:id" element={<DetallesReporte />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/informes" element={<PaginaInformes />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

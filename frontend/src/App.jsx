
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import Home from './pages/Home';
import Login from './pages/Login';
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

import './App.css';


const App = () => {
  return (
    <Router>
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
          <Route path="motos" element={<Motos />}/>
          <Route path="/crear-moto" element={<CrearMoto />} />
          <Route path="/editar-moto/:id" element={<EditarMoto />} />
          <Route path="inspeccion-recepcion" element={<InspeccionRecepcion/>}/>
          <Route path="/inspeccion-recepcion/listar" element={<ListaInspecciones />} />
          <Route path="/inspeccion-recepcion/detalles/:id" element={<DetalleInspeccion />} />
          <Route path="/ordenesTrabajo" element={<ListaOrdenes />} />
          <Route path="/ordenesTrabajo/crear" element={<CrearOrden />} />
          <Route path="/ordenesTrabajo/detalles/:id" element={<DetallesOrden />} />
          <Route path="/inspeccion-recepcion/editar/:id" element={<EditarInspeccion />} />


          {/* aqui voy a poner mis rutas para los demás módulos */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

import React from 'react';
import logo from '../assets/images/logopeq.jpg'; // Asegúrate de importar la imagen correctamente

const Header = () => {
  return (
    <header className="bg-primary text-white p-3">
      <div className="d-flex align-items-center">
        <img
          src={logo}
          alt="Logo de Motos Guate"
          className="rounded-circle me-3" // Clases Bootstrap para el logo redondo y margen a la derecha
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
        <div className="flex-grow-1 text-center">
          <h1>Gestión de Taller Mecánico</h1>
          <h2>MOTOS GUATE</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;

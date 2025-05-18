// src/components/Navbar.jsx
import React from 'react';
import './navbar.css';
import Logo from '../assets/autopartslogo.jpg';

const Navbar = () => {
    return (
        <div className="navbar">
            <img src={Logo} alt="AutoParts Logo" className="logo" />

            <ul className="nav-links">
                <li><a href="/">Inicio</a></li>
                <li><a href="/catalogo">Catálogo</a></li>
                <li><a href="/nosotros">Nosotros</a></li>
                <li><a href="/contacto">Contacto</a></li>
            </ul>

            <div className="searchBox">
                <input type="text" placeholder="Buscar repuesto..." />
                <button className="searchBtn"><i className="fas fa-search"></i></button>
            </div>
        </div>
    );
};

export default Navbar;

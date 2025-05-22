// src/components/Navbar.jsx
import React from "react";
import "./navbar.css";
import Logo from "../assets/autopartslogo.jpg";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-button" aria-label="Menu" />
        <button className="icon-button" aria-label="Search" />
        <img className="logo" src={Logo} alt="AutoParts logo" />
      </div>

      <h1 className="brand-name">AutoParts</h1>

      <nav className="nav-links">
        {["Inicio", "Catálogo", "Nosotros", "Contacto"].map((text) => (
          <a key={text} href="#" className="nav-pill">
            {text}
          </a>
        ))}
      </nav>

      <div className="auth-buttons">
        <button className="btn btn-secondary">Sign in</button>
        <button className="btn btn-primary">Register</button>
      </div>
    </header>
  );
}

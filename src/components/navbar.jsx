// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
const navItems = [
  { title: "Inicio", to: "/" },
  { title: "Catálogo", to: "/productos" },

];

export default function Navbar() {
  return (
     <div className="header">

      <div className="autoparts">AutoParts</div>

    <div className="navigation-pill-list">
        {navItems.map((item) => (
          <Link to={item.to} key={item.title} className="navigation-pill">
            <div className="title">{item.title}</div>
          </Link>
        ))}
      </div>

      <div className="header-auth">
        <div className="button">
          <div className="title">Inicia sesión</div>
        </div>
        <div className="button2">
          <div className="title">Registrate</div>
        </div>
      </div>
    </div>
  );
};

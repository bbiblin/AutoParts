import React, { useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import CartIcon from "./cartIcon";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Determinar si es distribuidor
  const isDistributor = user?.isDistribuitor;

  // Colores dinámicos basados en tipo de usuario
  const navbarBg = isDistributor ? 'bg-[#D72638]' : 'bg-[#1F3A93]';
  const hoverText = isDistributor ? 'hover:text-red-200' : 'hover:text-blue-300';
  const underlineColor = isDistributor ? 'bg-white' : 'bg-[#BB2F3D]';

  // Generar items dinámicamente según tipo de usuario
  const navItems = [
    { title: "Inicio", to: "/" },
    {
      title: isDistributor ? "Catálogo Mayorista" : "Catálogo",
      to: isDistributor ? "/catalogo_mayorista" : "/productos"
    },
    { title: "Productos destacados", to: "/productos_destacados" },
    { title: "Sobre nosotros", to: "/aboutUs" },
  ];

  return (
    <nav className={`${navbarBg} shadow-lg border-b border-[#F5F5F5] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`text-2xl font-bold text-[#F5F5F5] ${hoverText} transition-all duration-300 flex items-center space-x-2`}
            >
              <span>AutoParts</span>
              {isDistributor && (
                <span className="text-lg bg-white text-red-600 px-2 py-1 rounded-md font-semibold animate-pulse">
                  Mayoristas
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className={`relative text-[#F5F5F5] ${hoverText} px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 group`}
                >
                  <span className="relative z-10">{item.title}</span>
                  <span className={`absolute bottom-0 left-0 h-0.5 w-0 ${underlineColor} group-hover:w-full transition-all duration-300`}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Section + Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <CartIcon />

            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3">
                  {/* User Profile Link */}
                  <Link
                    to="/users/profile"
                    className={`flex items-center space-x-2 text-[#F5F5F5] ${hoverText} px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                  </Link>

                  {/* Welcome Message */}
                  <div className="text-[#F5F5F5] text-sm font-medium">
                    ¡Hola, {user.username}!
                  </div>
                </div>

                <Link
                  onClick={handleLogout}
                  to="/"
                  className={`${isDistributor ? 'bg-brand-darBlue text-[#F5F5F5]' : 'bg-[#D72638] text-[#F5F5F5] hover:bg-[#BB2F3D]'} px-6 py-2 rounded-lg text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar sesión</span>
                </Link>

              </>
            ) : (
              <>
                <Link
                  to="/users/login"
                  className="bg-[#F5F5F5] text-[#3a3a3a] px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#aaaaaa] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
                >
                  Inicia sesión
                </Link>
                <Link
                  to="/users/register"
                  className={`${isDistributor ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#D72638] text-[#F5F5F5] hover:bg-[#BB2F3D]'} px-6 py-2 rounded-lg text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  Regístrate
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon />
            <button
              onClick={toggleMenu}
              className={`text-[#F5F5F5] ${hoverText} focus:outline-none p-2 rounded-lg transition-colors duration-300`}
              aria-label="Toggle menu"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${isMenuOpen
          ? "max-h-96 opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
          }`}
      >
        <div className={`px-2 pt-2 pb-3 space-y-1 ${navbarBg} border-t border-[#F5F5F5] shadow-lg`}>
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={`text-[#F5F5F5] ${hoverText} block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300`}
            >
              {item.title}
            </Link>
          ))}

          {/* Mobile Auth Section */}
          <div className="pt-4 space-y-3 border-t border-[#F5F5F5] mt-4">
            {isLoggedIn ? (
              <>
                <div className="text-[#F5F5F5] px-4 py-2 text-center font-medium">
                  <div>¡Hola, {user.username}!</div>
                </div>

                {/* Mobile Profile Link */}
                <Link
                  to="/perfil"
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full text-[#F5F5F5] ${hoverText} px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 shadow-lg flex items-center justify-center space-x-2`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mi Perfil</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className={`w-full ${isDistributor ? 'bg-brand-darBlue text-[#F5F5F5]' : 'bg-[#D72638] text-[#F5F5F5] hover:bg-[#BB2F3D]'} px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 shadow-lg flex items-center justify-center space-x-2`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/users/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-[#F5F5F5] text-[#333333] px-4 py-3 rounded-lg text-base font-medium hover:bg-[#929292] transition-all duration-300 shadow-lg block text-center"
                >
                  Inicia sesión
                </Link>
                <Link
                  to="/users/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full ${isDistributor ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#D72638] text-[#F5F5F5] hover:bg-[#BB2F3D]'} px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 shadow-lg block text-center`}
                >
                  Regístrate
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
import React, { useState } from "react";
import "../../index.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Items de navegación para admin
  const navItems = [
    { title: "Inicio", to: "/adminHome" },
    { title: "Productos", to: "/adminProductos" },
    { title: "Categorías", to: "/adminCategories" },
    { title: "Marcas", to: "/adminBrands" },
    { title: "Usuarios", to: "/adminUsuarios" },
    { title: "Pedidos", to: "/adminPedidos" },
  ];

  return (
    <nav className="bg-brand-darBlue sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/adminHome"
              className="text-m font-bold text-[#FFFF] hover:text-[#a0a0a0] transition-all duration-300 flex items-center space-x-2"
            >
              <span>AutoParts - Panel de administrador</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="relative text-[#FFFF] hover:text-[#979797] px-3 py-2 rounded-lg text-sm font-medium group flex items-center space-x-2"
                >
                  <span className="relative z-10">{item.title}</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tablet Navigation (Medium screens) */}
          <div className="hidden lg:block xl:hidden">
            <div className="ml-6 flex items-baseline space-x-2">
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="relative text-[#ffff] hover:text-[#979797] px-2 py-2 rounded-lg text-xs font-medium  group flex flex-col items-center space-y-1"
                  title={item.title}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="relative z-10 hidden lg:block">{item.title.split(' ')[0]}</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}

              <div className="relative group">
                <button className="text-[#ffff] hover:text-[#979797]  px-2 py-2 rounded-lg text-xs font-medium  flex flex-col items-center space-y-1">
                  <span className="text-base">⋯</span>
                  <span className="text-xs">Más</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48  rounded-lg shadow-lg border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {navItems.slice(4).map((item) => (
                    <Link
                      key={item.title}
                      to={item.to}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors duration-300 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop User Section */}
          <div className="hidden lg:flex items-center space-x-4">


            {/* Información del usuario */}
            <div className="flex items-center space-x-3 rounded-lg px-4 py-2">

              <div className="flex flex-col">
                <span className="text-[#FFFF] text-sM font-bold">
                  {user?.username || 'Administrador'}
                </span>
                <span className="text-[#ffff] text-xs">Administrador</span>
              </div>
            </div>

            {/* Botón de logout */}
            <button
              onClick={handleLogout}
              className="bg-brand-redDark text-[#ffff] px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Cerrar sesión</span>
            </button>
          </div>

          {/* Mobile/Tablet menu button */}
          <div className="lg:hidden flex items-center space-x-2">

            <button
              onClick={toggleMenu}
              className="text-[#ffff] hover:[#979797]  focus:outline-none p-2 rounded-lg transition-colors duration-300"
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

      {/* Mobile/Tablet menu */}
      <div
        className={`lg:hidden transform transition-all duration-300 ease-in-out ${isMenuOpen
          ? "max-h-[500px] opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
          }`}
      >
        <div className="px-2 pt-2 pb-3 bg-slate-800 border-t border-slate-700 shadow-lg">
          {/* Navigation Items in Mobile */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-[#ffff] hover:text-[#979797]  px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
          {/* Mobile/Tablet User Section */}
          <div className="pt-4 space-y-3 border-t border-slate-700 mt-4">
            <div className="text-gray-300 px-4 py-2 text-center">
              <div className="flex items-center justify-center space-x-3 bg-slate-700 rounded-lg px-4 py-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-base font-medium">
                    {user?.username || 'Administrador'}
                  </span>
                  <span className="text-gray-400 text-sm">Administrador</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:bg-red-700 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

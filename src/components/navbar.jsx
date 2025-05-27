// src/components/Navbar.jsx
import React from "react";
import { useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Inicio", to: "/" },
  { title: "Catálogo", to: "/productos" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#1F3A93] shadow-lg border-b border-[#F5F5F5] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl font-bold text-[#F5F5F5] hover:text-[#D72638]-300 transition-colors duration-300"
            >
              AutoParts
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="relative text-[#F5F5F5] hover:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-blue-800 group"
                >
                  <span className="relative z-10">{item.title}</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#BB2F3D] group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/users/login"
              className="bg-[#F5F5F5] text-[#3a3a3a] px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#aaaaaa] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
            >
              Inicia sesión
            </Link>

            <Link
            to='/users/register'
            className="bg-[#D72638] text-[#F5F5F5] px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#BB2F3D] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Regístrate
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#000000] hover:text-blue-300 focus:outline-none focus:text-blue-300 p-2 rounded-lg transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#1F3A93] border-t border-[#F5F5F5] shadow-lg">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.to}
              onClick={() => setIsMenuOpen(false)}
              className="text-[#F5F5F5] hover:text-blue-300 hover:bg-blue-800 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
            >
              {item.title}
            </a>
          ))}

          {/* Mobile Auth Buttons */}
          <div className="pt-4 space-y-3 border-t border-[#F5F5F5] mt-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-[#F5F5F5] text-[#333333] px-4 py-3 rounded-lg text-base font-medium hover:bg-[#929292] transition-all duration-300 shadow-lg"
            >
              Inicia sesión
            </button>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-[#D72638] text-[#F5F5F5] px-4 py-3 rounded-lg text-base font-medium hover:bg-[#BB2F3D] transition-all duration-300 shadow-lg"
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

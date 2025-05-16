import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar"; // Cambiamos la ruta de importación
import Catalogo from "./components/catalogo"; // Añadimos la importación del Catalogo

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="container mx-auto mt-16 p-4">
          <Routes>
            <Route path="/" element={<Catalogo />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
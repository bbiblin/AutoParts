// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Productos from './pages/productos';
import Login from './pages/login';
import Register from './pages/register';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Cart from './pages/cart';
import Destacados from './pages/productosDestacados';
import { AuthProvider } from './contexts/authContext';
import { CartProvider } from './contexts/cartContext';
import '../src/index.css';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/productos_destacados" element={<Destacados />} />
          <Route path="/carrito" element={<Cart />} />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

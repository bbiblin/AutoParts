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
import DetallesProducto from './pages/detalleProducto';
import CatalogoMayorista from './pages/catalogoMayorista';
import AboutUs from './pages/aboutUs';
import WebPayConfirm from './pages/webpayConfirm';
import { AuthProvider } from './contexts/authContext';
import { CartProvider } from './contexts/cartContext';
import '../src/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


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
          <Route path="/cart" element={<Cart />} />
          <Route path="/detalles_producto/:id" element={<DetallesProducto />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/webpay/confirm" element={<WebPayConfirm />} />


          <Route path="/catalogo_mayorista"
            element={

              <CatalogoMayorista />

            }
          />

        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

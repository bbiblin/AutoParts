import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Productos from './pages/productos'
import '../src/index.css'
import Login from './pages/login'
import Register from './pages/register'
import { AuthProvider } from './contexts/authContext' // asegúrate de usar la capitalización correcta

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

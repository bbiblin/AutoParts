import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Productos from './pages/productos'
import '../src/index.css'
import Login from './pages/login'
import Register from './pages/register'



export default function App() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/users/login" element={<Login />} />
      <Route path="/users/register" element={<Register />} />
    </Routes>
  )
}
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Productos from './pages/productos'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/productos" element={<Productos/>} />

      </Routes>
    </Router>
  )
}
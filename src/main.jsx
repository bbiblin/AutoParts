import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Navbar } from 'react-bootstrap';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <App />
  </StrictMode>,
)

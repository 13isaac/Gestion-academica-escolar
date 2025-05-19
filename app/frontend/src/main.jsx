import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Prueba from './pages/Prueba.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Prueba/>
  </StrictMode>,
)

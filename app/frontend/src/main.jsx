import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@popperjs/core'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Perfil from './pages/Perfil.jsx'
import ListaAlumnos from './pages/ListaAlumnos.jsx'
import DetalleCurso from './pages/DetalleCurso.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/perfil" element={<Perfil/>} />
        <Route path="/alumnos" element={<ListaAlumnos/>}/>
        <Route path="/detallecurso/:id_curso" element={<DetalleCurso />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

import React from 'react'
import "../styles/Boton.css"
import { useNavigate } from 'react-router-dom'

export const BotonCurso = ({ texto, cursoId, rol }) => {
    const navigate = useNavigate()
    
    const handleClick = () => {
        // Admin puede ver ambas vistas, por defecto va a detalle
        if (rol === 'profesor') {
            navigate(`/alumnos?curso=${encodeURIComponent(texto)}&id=${cursoId}`)
        } else {
            // Para 'user' (estudiante) y 'admin'
            navigate(`/detallecurso/${cursoId}`)
        }
    }

    return (
        <button className='boton' onClick={handleClick}>
            {texto}
        </button>
    )
}
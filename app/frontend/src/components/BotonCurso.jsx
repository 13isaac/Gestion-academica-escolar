import React from 'react'
import "../styles/Boton.css"
import { useNavigate } from 'react-router-dom'

export const BotonCurso = ({ texto, cursoId, rol }) => {
    const navigate = useNavigate()
    
    const handleClick = () => {
        if (rol == "admin" || rol == "profesor") {
            navigate(`/alumnos?curso=${encodeURIComponent(texto)}&id=${cursoId}`)
        } else {
            navigate(`/detallecurso/${cursoId}`)
        }
    }

    return (
        <button className='boton' onClick={handleClick}>
            {texto}
        </button>
    )
}
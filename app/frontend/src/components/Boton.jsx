import React from 'react'
import "../styles/Boton.css"

import { useNavigate } from 'react-router-dom'; 

export const Boton = ({texto,ruta}) => {
    const navigate = useNavigate();
    return (
        <button className='boton' onClick={() => navigate(ruta)}>{texto}</button>
    )
}

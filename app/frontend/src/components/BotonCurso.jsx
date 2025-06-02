import React from 'react'
import "../styles/Boton.css"
import { useNavigate } from 'react-router-dom'

export const BotonCurso = ({ texto, cursoId, rol }) => {
    const navigate = useNavigate();
    
    // Asumimos que el rol ya viene normalizado como array desde Perfil.jsx
    const isAdmin = rol.includes('admin');
    const isProfesor = rol.includes('profesor');

    const handleDetalleCurso = () => navigate(`/detallecurso/${cursoId}`);
    const handleListaAlumnos = () => navigate(`/alumnos?curso=${encodeURIComponent(texto)}&id=${cursoId}`);

    return (
        <div className="curso-container">
            {isAdmin ? (
                <div className="botones-admin">
                    <button className="boton" onClick={handleDetalleCurso}>
                        {texto} - Ver Detalle
                    </button>
                    <button className="boton" onClick={handleListaAlumnos}>
                        {texto} - Ver Alumnos
                    </button>
                </div>
            ) : (
                <button 
                    className="boton" 
                    onClick={isProfesor ? handleListaAlumnos : handleDetalleCurso}
                >
                    {texto}{isProfesor ? '' : 'Ver Detalle'}
                </button>
            )}
        </div>
    )
}
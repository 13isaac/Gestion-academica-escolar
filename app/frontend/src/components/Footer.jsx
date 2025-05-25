import React from 'react';
import '../styles/footer.css';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Sobre Nosotros</h3>
                    <p>Gestión Académica Escolar - Sistema integral para instituciones educativas</p>
                </div>
        
        <div className="footer-section">
            <h3>Contacto</h3>
            <p>Email: contacto@escuela.edu</p>
            <p>Teléfono: +123 456 7890</p>
        </div>
        
        <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/about">Acerca de</a></li>
                <li><a href="/contact">Contacto</a></li>
            </ul>
        </div>
        </div>
    
        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Gestión Académica Escolar. Todos los derechos reservados.</p>
        </div>
        </footer>
    );
};
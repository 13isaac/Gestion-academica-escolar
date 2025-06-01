import '../styles/Navegador.css'

import { Nav, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Navegador = ({icono, user, dato}) => {

    return (
        <Nav className='navegador-fijo'>
            <Nav.Item>
                <Link to="/perfil" className="nav-link">
                    <Image src={icono} roundedCircle className='icon-nav'/>
                    <h4 className='titulo'>{user}</h4>
                </Link>
            </Nav.Item>
            <Nav.Item>
                <h5 className='dato'>{dato}</h5>    
            </Nav.Item>
            <Nav.Item className="ms-auto">
                <Link to="/" className='nav-link dato-link'>Logout</Link>
            </Nav.Item>
        </Nav>
    );
}
export default Navegador
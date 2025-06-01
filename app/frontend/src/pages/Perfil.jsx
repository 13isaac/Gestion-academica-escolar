import '../styles/Perfil.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { Boton } from '../components/Boton'

import Admin from '../assets/admin.png'
import Estudiante from '../assets/estudiante.png'
import Profesor from '../assets/profesor.png'

import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'

export const Perfil = () => {
    const {data,error} = useFetch("http://localhost:5000/api/cursos");
    const navigate = useNavigate();

    const nombreUsuario = localStorage.getItem('nombre_usuario');
    const rol = localStorage.getItem('rol');

    return (
        <Container fluid className='contenedor-fluid'>
            <Row className='contenedor'>
                <Col className="d-flex flex-column align-items-center text-center carta-perfil" md={5}>
                    <Image src={Admin} roundedCircle className='icono'/>
                    <div className='datos'>
                        <h5 className='nombre-user'>{nombreUsuario}</h5>
                        <h6 className='rol-user'>{rol}</h6>
                    </div>
                </Col>
                <Col md={{ span: 5, offset: 1 }}>
                    <h2 className='titulo-cursos'>Cursos Disponibles</h2>
                    <Row md={3} className='borde'>
                        {data?.map((curso) => (
                            <Col key={curso.id_curso}>
                                <Boton 
                                    texto={curso.nombre} 
                                    ruta={`/alumnos?curso=${encodeURIComponent(curso.nombre)}&id=${encodeURIComponent(curso.id_curso)}`}
                                />
                            </Col>))}
                        
                    </Row>
                    <h2 className='titulo-datos'>Datos</h2>
                    <Row className='borde'>
                        <div>
                            <ul>
                                <li className='lista'><strong>Nombre: </strong> Isaac</li>
                            </ul>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
export default Perfil
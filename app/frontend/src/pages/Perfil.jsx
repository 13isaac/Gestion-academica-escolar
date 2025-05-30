import '../styles/Perfil.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Boton } from '../components/Boton'

import Admin from '../assets/admin.png'
import Estudiante from '../assets/estudiante.png'
import Profesor from '../assets/profesor.png'

export const Perfil = () => {
    return (
        <Container className='body' fluid>
            <Row>
                <Col className="d-flex flex-column align-items-center text-center carta" md={4}>
                    <Image src={Admin} roundedCircle className='icono'/>
                    <div className='datos'>
                        <h5 className='nombre-user'>Nombre de usuario</h5>
                        <h6 className='rol-user'>Rol</h6>
                    </div>
                </Col>
                <Col md={{ span: 6, offset: 2 }}>
                    <h2 className='titulo-cursos'>Cursos Disponibles</h2>
                    <Row md={3} className='borde'>
                        <div className='botones'>
                            <Boton texto="Matematica"/>
                            <Boton texto="hola"/>
                            <Boton texto="hola"/>
                        </div>
                        <div className='botones'>
                            <Boton texto="hola"/>
                            <Boton texto="hola"/>
                            <Boton texto="hola"/>
                        </div>
                        <div className='botones'>
                            <Boton texto="hola"/>
                            <Boton texto="hola"/>
                            <Boton texto="hola"/>
                        </div>
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
import '../styles/ListaAlumnos.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Admin from '../assets/admin.png'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Navegador from '../components/Navegador'

import { useSearchParams } from 'react-router-dom';

export const ListaAlumnos = () => {
    const [searchParams] = useSearchParams();
    const curso = searchParams.get('curso');
    return (
        <Container fluid className='ps-0 pe-0 contenido'>
            <Navegador icono={Admin} user="user" dato={curso}/>
            <Row md={4} className='m-3'>
                <Col className='me-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta-azul' variant="outline-primary">Editar</Button>
                            <Button className='m-1 boton-carta-rojo' variant="outline-danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='m-0'>
                    <Card className='carta'>
                        <Card.Body >
                            <Card.Title>Nombre estudiante</Card.Title>
                                <ul>
                                    <li><strong>datos:</strong>aaaaa</li>
                                </ul>
                            <Button className='m-1 boton-carta' variant="primary">Editar</Button>
                            <Button className='m-1 boton-carta' variant="danger">Eliminar</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
export default ListaAlumnos
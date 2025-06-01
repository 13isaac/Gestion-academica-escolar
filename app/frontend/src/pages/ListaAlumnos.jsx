import '../styles/ListaAlumnos.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Admin from '../assets/admin.png'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Navegador from '../components/Navegador'

import { useSearchParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'

export const ListaAlumnos = () => {
    const [searchParams] = useSearchParams();
    const curso = searchParams.get('curso');
    const id_curso = searchParams.get('id');
    const navigate = useNavigate()
    
    const {data,error} = useFetch(`http://127.0.0.1:5000/api/alumnos/curso/${encodeURIComponent(id_curso)}`)

    const handleEditar = (id_alumno) => {
        navigate(`/formulario?id_alumno=${id_alumno}&id_curso=${id_curso}`)
    }

    return (
        <Container fluid className='ps-0 pe-0 contenido'>
            <Navegador icono={Admin} user="user" dato={curso}/>
            <Row md={4} className='m-3'>
                {data?.map((alumno) => (
                    
                    <Col className='me-0' key={alumno.id_alumno}>
                        <Card className='carta'>
                            <Card.Body>
                                <Card.Title>{alumno.nombre} {alumno.apellido}</Card.Title>
                                <ul>
                                    <li key={alumno.id_alumno}><strong>ci: </strong>{alumno.ci}</li>
                                    <li key={alumno.id_alumno+1}><strong>fecha de nacimiento: </strong>{alumno.fecha_nacimiento}</li>
                                    <li key={alumno.id_alumno+2}><strong>correo: </strong>{alumno.correo}</li>
                                    <li key={alumno.id_alumno+3}><strong>estado: </strong>{alumno.estado}</li>
                                </ul>
                                <Button 
                                    className='m-1 boton-carta-azul' 
                                    variant="outline-primary" 
                                    onClick={() => handleEditar(alumno.id_alumno)}
                                >
                                    Editar
                                </Button>
                                <Button 
                                    className='m-1 boton-carta-rojo' 
                                    variant="outline-danger"
                                >
                                    Eliminar
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}
export default ListaAlumnos
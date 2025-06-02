import '../styles/Perfil.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { BotonCurso } from '../components/BotonCurso'
import Admin from '../assets/admin.png'
import Estudiante from '../assets/estudiante.png'
import Profesor from '../assets/profesor.png'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'

export const Perfil = () => {
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    const rolRaw = localStorage.getItem('rol');
    const navigate = useNavigate();

    // Función para normalizar el rol
    const normalizeRol = (rol) => {
        try {
            if (typeof rol === 'string' && rol.startsWith('[')) {
                return JSON.parse(rol);
            }
            if (typeof rol === 'string') {
                return [rol];
            }
            if (Array.isArray(rol)) {
                return rol;
            }
            return ['user'];
        } catch (e) {
            return ['user'];
        }
    };

    const rol = normalizeRol(rolRaw);
    const rolNormalizado = rol[0];

    // Determinar la URL basada en el rol
    let apiUrl = 'http://localhost:5000/api/cursos'; // Default para admin
    if (rolNormalizado === 'profesor') {
        apiUrl = `http://localhost:5000/api/cursos/por/profesores/${encodeURIComponent(nombreUsuario)}`;
    } else if (rolNormalizado === 'user') {
        apiUrl = `http://localhost:5000/api/cursos/por/alumnos/${encodeURIComponent(nombreUsuario)}`;
    }

    const {data, error} = useFetch(apiUrl);

    let imagenPerfil = Estudiante;
    if (rolNormalizado === 'admin') imagenPerfil = Admin;
    else if (rolNormalizado === 'profesor') imagenPerfil = Profesor;
    
    return (
        <Container fluid className='contenedor-fluid'>
            <Row className='contenedor'>
                <Col className="d-flex flex-column align-items-center text-center carta-perfil" md={5}>
                    <Image src={imagenPerfil} roundedCircle className='icono'/>
                    <div className='datos'>
                        <h5 className='nombre-user'>{nombreUsuario}</h5>
                        <h6 className='rol-user'>{rolNormalizado}</h6>
                    </div>
                </Col>
                <Col md={{ span: 5, offset: 1 }}>
                    <h2 className='titulo-cursos'>Cursos Disponibles</h2>
                    <Row md={3} className='borde'>
                        {data?.map((curso) => (
                            <Col key={curso.id_curso}>
                                <BotonCurso 
                                    texto={curso.nombre} 
                                    cursoId={curso.id_curso}
                                    rol={rol}
                                />
                            </Col>
                        ))}
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
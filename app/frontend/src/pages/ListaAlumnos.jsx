import '../styles/ListaAlumnos.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Navegador from '../components/Navegador'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Admin from '../assets/admin.png'
import Estudiante from '../assets/estudiante.png'
import Profesor from '../assets/profesor.png'

export const ListaAlumnos = () => {
    const [searchParams] = useSearchParams();
    const curso = searchParams.get('curso');
    const id_curso = searchParams.get('id');
    const navigate = useNavigate();
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rol, setRol] = useState('user');

    // Obtener el rol del usuario al cargar el componente
    useEffect(() => {
        const storedRol = localStorage.getItem('rol');
        try {
            const parsedRol = JSON.parse(storedRol);
            setRol(Array.isArray(parsedRol) ? parsedRol[0] : parsedRol);
        } catch {
            setRol(storedRol || 'user');
        }
    }, []);

    // Determinar la imagen según el rol
    const imagenPerfil = rol === 'admin' ? Admin : 
                        rol === 'profesor' ? Profesor : Estudiante;

    // Función para obtener los datos completos de un alumno
    const fetchAlumnoData = async (id_alumno) => {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `http://127.0.0.1:5000/api/alumnos/${id_alumno}`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            throw new Error(`Error obteniendo datos del alumno ${id_alumno}`);
        }
        return await response.json();
    };

    // Función para obtener los alumnos del curso
    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 1. Obtener la lista de IDs de alumnos inscritos en el curso
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No hay token de autenticación');
                }

                const response = await fetch(
                    `http://127.0.0.1:5000/api/alumnos/curso/${id_curso}`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/');
                    }
                    throw new Error(`Error ${response.status}: ${await response.text()}`);
                }

                const matriculas = await response.json();
                
                // 2. Obtener los datos completos de cada alumno
                const alumnosPromises = matriculas.map(matricula => 
                    fetchAlumnoData(matricula.id_alumno)
                );
                
                const alumnosData = await Promise.all(alumnosPromises);
                setAlumnos(alumnosData);
                
            } catch (err) {
                setError(err.message);
                console.error("Error obteniendo alumnos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlumnos();
    }, [id_curso, navigate]);

    const handleEditar = (id_alumno) => {
        navigate(`/formulario?id_alumno=${id_alumno}&id_curso=${id_curso}`);
    }

    const handleEliminar = async (id_alumno) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://127.0.0.1:5000/api/alumnos/${id_alumno}`, 
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error al eliminar: ${await response.text()}`);
            }

            // Actualizar la lista después de eliminar
            setAlumnos(alumnos.filter(alumno => alumno.id_alumno !== id_alumno));
        } catch (err) {
            console.error("Error eliminando alumno:", err);
            setError(err.message);
        }
    }

    if (loading) return (
        <Container className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando lista de alumnos...</p>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <div className="alert alert-danger">
                <h4>Error</h4>
                <p>{error}</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                    Reintentar
                </Button>
                <Button variant="secondary" onClick={() => navigate('/perfil')} className="ms-2">
                    Volver al perfil
                </Button>
            </div>
        </Container>
    );

    return (
        <Container fluid className='ps-0 pe-0 contenido'>
            <Navegador icono={imagenPerfil} user={localStorage.getItem('nombre_usuario')} dato={curso}/>
            
            <Row md={4} className='m-3'>
                {alumnos.map((alumno) => (
                    <Col className='me-0 mb-4' key={alumno.id_alumno}>
                        <Card className='carta'>
                            <Card.Body>
                                <Card.Title>{alumno.nombre} {alumno.apellido}</Card.Title>
                                <ul className="list-unstyled">
                                    <li><strong>C.I.: </strong>{alumno.ci}</li>
                                    <li><strong>Fecha Nac.: </strong>
                                        {new Date(alumno.fecha_nacimiento).toLocaleDateString()}
                                    </li>
                                    <li><strong>Correo: </strong>{alumno.correo}</li>
                                    <li><strong>Estado: </strong>
                                        <span className={`badge ${alumno.estado === 'Activo' ? 'bg-success' : 'bg-warning'}`}>
                                            {alumno.estado}
                                        </span>
                                    </li>
                                </ul>
                                <div className="d-flex justify-content-between">
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => handleEditar(alumno.id_alumno)}
                                    >
                                        Editar
                                    </Button>
                                    {['admin', 'profesor'].includes(rol) && (
                                        <Button 
                                            variant="outline-danger"
                                            onClick={() => handleEliminar(alumno.id_alumno)}
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}
export default ListaAlumnos
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Button, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Boton } from '../components/Boton'
import axios from 'axios';
import Admin from '../assets/admin.png';
import Estudiante from '../assets/estudiante.png';
import Profesor from '../assets/profesor.png';
import '../styles/DetalleCurso.css'
import Navegador from '../components/Navegador';

const DetalleCurso = () => {
  const { id_curso } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursoData, setCursoData] = useState({
    alumno: {},
    curso: {},
    profesor: {},
    notas: [],
    porcentaje_asistencia: 0
  });
  
  // Obtenemos datos del usuario desde localStorage
  const nombreUsuario = localStorage.getItem('nombre_usuario');
  const rol = localStorage.getItem('rol');
  
  // Seleccionamos la imagen según el rol
  let imagenPerfil = Estudiante;
  if (rol === 'admin') imagenPerfil = Admin;
  else if (rol === 'profesor') imagenPerfil = Profesor;

  useEffect(() => {
    const fetchCursoData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://127.0.0.1:5000/api/alumnos/curso/${id_curso}/detalle`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setCursoData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCursoData();
  }, [id_curso]);
  
  return (
  <>
    <Navegador icono={imagenPerfil} user={nombreUsuario}/>
    <Container className="curso-container py-3">
      <Card className="curso-card">
        <Card.Body>
          <Row className="mb-4">
            <Col>
              <h3 className="curso-titulo">{cursoData.curso.nombre || 'Curso no disponible'}</h3>
              <p className="curso-descripcion">{cursoData.curso.descripcion || ''}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <h5 className="subtitulos">Información del Profesor</h5>
                <div className="info-caja profesor-info p-3 rounded">
                  <p><strong>Nombre:</strong> {cursoData.profesor.nombre || 'N/A'} {cursoData.profesor.apellido || ''}</p>
                  <p><strong>Correo:</strong> {cursoData.profesor.correo || 'N/A'}</p>
                  </div>
            </Col>

            <Col md={6}>
              <h5 className="subtitulos">Asistencia</h5>
                <div className="info-caja asistencia-info p-3 rounded">
                  <ProgressBar 
                    now={cursoData.porcentaje_asistencia} 
                    label={`${cursoData.porcentaje_asistencia}%`} 
                    variant={cursoData.porcentaje_asistencia > 70 ? 'success' : 'warning'}
                    className="mb-2"
                  />
                  <small className="asistencia-text">Porcentaje de asistencia en el curso</small>
                </div>
            </Col>
          </Row>

          <h5 className="subtitulos mt-4">Notas</h5>
            {cursoData.notas.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Evaluación</th>
                  <th>Tipo</th>
                  <th>Calificación</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              
              <tbody>
                {cursoData.notas.map((nota, index) => (
                  <tr key={index}>
                    <td>{nota.evaluacion}</td>
                    <td>{nota.tipo_evaluacion}</td>
                    <td>{nota.calificacion}</td>
                    <td>{new Date(nota.fecha).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
              <div className="alert alert-info">No hay notas registradas para este curso</div>
          )}
          
          <div className="text-center mt-4">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/perfil')}>
              Volver al Perfil
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  </>
  );
}

export default DetalleCurso;

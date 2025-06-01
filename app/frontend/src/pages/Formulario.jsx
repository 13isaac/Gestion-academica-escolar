import '../styles/Formulario.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useState, useEffect } from 'react'

export const Formulario = () => {
    const [searchParams] = useSearchParams()
    const id_alumno = searchParams.get('id_alumno')
    const id_curso = searchParams.get('id_curso')
    const { data: alumnoData } = useFetch(`http://127.0.0.1:5000/api/alumnos/${encodeURIComponent(id_alumno)}`);
    const { data: cursoData } = useFetch(`http://127.0.0.1:5000/api/notas/cursos/${encodeURIComponent(id_curso)}/alumnos/${encodeURIComponent(id_alumno)}`);
    
    // Estado para el tipo de evaluación seleccionado
    const [tipoEvaluacionSeleccionado, setTipoEvaluacionSeleccionado] = useState('Parcial');
    
    // Estado para las notas editables
    const [notasEditables, setNotasEditables] = useState([]);
    
    // Estado para las asistencias editables
    const [asistenciasEditables, setAsistenciasEditables] = useState([]);
    
    // Estado para nueva nota
    const [nuevaNota, setNuevaNota] = useState({
        evaluacion: 'Parcial',
        tipo_evaluacion: '',
        calificacion: '',
        fecha: new Date().toISOString().slice(0, 16)
    });

    // Estado para nueva asistencia
    const [nuevaAsistencia, setNuevaAsistencia] = useState({
        fecha: new Date().toISOString().slice(0, 16),
        sesion: '',
        estado_asistencia: 'Presente'
    });

    // Estados para controlar formularios desplegables
    const [mostrarFormularioNuevaNota, setMostrarFormularioNuevaNota] = useState(false);
    const [mostrarFormularioNuevaAsistencia, setMostrarFormularioNuevaAsistencia] = useState(false);

    // Cargar datos iniciales cuando la data llegue
    useEffect(() => {
        if (cursoData) {
            // Filtrar notas según el tipo de evaluación seleccionado
            const notasFiltradas = cursoData.notas?.filter(nota => nota.evaluacion === tipoEvaluacionSeleccionado) || [];
            setNotasEditables(notasFiltradas);
            
            // Cargar todas las asistencias
            setAsistenciasEditables(cursoData.asistencias || []);
            
            // Reiniciar formularios
            setNuevaNota({
                evaluacion: tipoEvaluacionSeleccionado,
                tipo_evaluacion: '',
                calificacion: '',
                fecha: new Date().toISOString().slice(0, 16)
            });
            setNuevaAsistencia({
                fecha: new Date().toISOString().slice(0, 16),
                sesion: '',
                estado_asistencia: 'Presente'
            });
        }
    }, [cursoData, tipoEvaluacionSeleccionado]);

    // Manejar cambio en el select de evaluación
    const handleEvaluacionChange = (e) => {
        const value = e.target.value;
        setTipoEvaluacionSeleccionado(value);
        setNuevaNota(prev => ({ ...prev, evaluacion: value }));
    };

    // Manejar cambios en las notas existentes
    const handleNotaExistenteChange = (index, field, value) => {
        const updatedNotas = [...notasEditables];
        
        // Validar calificación si es el campo
        if (field === 'calificacion') {
            value = value.replace(/[^0-9]/g, '');
            if (value !== '' && (parseInt(value) < 0 || parseInt(value) > 100)) {
                return;
            }
        }
        
        updatedNotas[index][field] = value;
        setNotasEditables(updatedNotas);
    };

    // Manejar cambios en las asistencias existentes
    const handleAsistenciaChange = (index, field, value) => {
        const updatedAsistencias = [...asistenciasEditables];
        updatedAsistencias[index][field] = value;
        setAsistenciasEditables(updatedAsistencias);
    };

    // Manejar cambios en la nueva nota
    const handleNuevaNotaChange = (e) => {
        const { name, value } = e.target;
        
        // Validar calificación
        if (name === 'calificacion') {
            let val = value.replace(/[^0-9]/g, '');
            if (val !== '' && (parseInt(val) < 0 || parseInt(val) > 100)) {
                return;
            }
            setNuevaNota(prev => ({ ...prev, [name]: val }));
        } else {
            setNuevaNota(prev => ({ ...prev, [name]: value }));
        }
    };

    // Manejar cambios en la nueva asistencia
    const handleNuevaAsistenciaChange = (e) => {
        const { name, value } = e.target;
        setNuevaAsistencia(prev => ({ ...prev, [name]: value }));
    };

    // Actualizar notas existentes
    const handleActualizarNotas = async () => {
        try {
            // Actualizar notas existentes
            for (const nota of notasEditables) {
                await fetch(`http://127.0.0.1:5000/api/notas/${nota.id_nota}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        id_alumno: id_alumno,
                        id_curso: id_curso,
                        evaluacion: nota.evaluacion,
                        tipo_evaluacion: nota.tipo_evaluacion,
                        calificacion: parseFloat(nota.calificacion),
                        fecha: nota.fecha
                    })
                });
            }
            
            alert('Notas actualizadas exitosamente!');
        } catch (error) {
            console.error('Error al actualizar notas:', error);
            alert('Error al actualizar las notas');
        }
    };

    // Actualizar asistencias existentes
    const handleActualizarAsistencias = async () => {
        try {
            // Actualizar asistencias existentes
            for (const asistencia of asistenciasEditables) {
                await fetch(`http://127.0.0.1:5000/api/asistencias/${asistencia.id_asistencia}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        id_alumno: id_alumno,
                        id_curso: id_curso,
                        fecha: asistencia.fecha,
                        sesion: asistencia.sesion,
                        estado_asistencia: asistencia.estado_asistencia
                    })
                });
            }
            
            alert('Asistencias actualizadas exitosamente!');
        } catch (error) {
            console.error('Error al actualizar asistencias:', error);
            alert('Error al actualizar las asistencias');
        }
    };

    // Agregar nueva nota
    const handleSubmitNuevaNota = async (e) => {
        e.preventDefault();
        
        try {
            if (nuevaNota.calificacion && nuevaNota.tipo_evaluacion && nuevaNota.fecha) {
                const response = await fetch(`http://127.0.0.1:5000/api/notas`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        id_alumno: id_alumno,
                        id_curso: id_curso,
                        evaluacion: nuevaNota.evaluacion,
                        tipo_evaluacion: nuevaNota.tipo_evaluacion,
                        calificacion: parseFloat(nuevaNota.calificacion),
                        fecha: nuevaNota.fecha
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                
                // Actualizar la lista de notas
                const updatedResponse = await fetch(`http://127.0.0.1:5000/api/notas/cursos/${encodeURIComponent(id_curso)}/alumnos/${encodeURIComponent(id_alumno)}`);
                const updatedData = await updatedResponse.json();
                const notasFiltradas = updatedData.notas.filter(nota => nota.evaluacion === tipoEvaluacionSeleccionado);
                setNotasEditables(notasFiltradas);
                setAsistenciasEditables(updatedData.asistencias || []);
                
                // Resetear el formulario y cerrarlo
                setNuevaNota({
                    evaluacion: tipoEvaluacionSeleccionado,
                    tipo_evaluacion: '',
                    calificacion: '',
                    fecha: new Date().toISOString().slice(0, 16)
                });
                setMostrarFormularioNuevaNota(false);
                
                alert('Nueva nota agregada exitosamente!');
            } else {
                alert('Por favor complete todos los campos requeridos');
            }
        } catch (error) {
            console.error('Error al agregar nueva nota:', error);
            alert('Error al agregar la nueva nota');
        }
    };

    // Agregar nueva asistencia
    const handleSubmitNuevaAsistencia = async (e) => {
        e.preventDefault();
        
        try {
            if (nuevaAsistencia.sesion && nuevaAsistencia.fecha && nuevaAsistencia.estado_asistencia) {
                const response = await fetch(`http://127.0.0.1:5000/api/asistencias`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        id_alumno: id_alumno,
                        id_curso: id_curso,
                        fecha: nuevaAsistencia.fecha,
                        sesion: nuevaAsistencia.sesion,
                        estado_asistencia: nuevaAsistencia.estado_asistencia
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                
                // Actualizar la lista de asistencias
                const updatedResponse = await fetch(`http://127.0.0.1:5000/api/notas/cursos/${encodeURIComponent(id_curso)}/alumnos/${encodeURIComponent(id_alumno)}`);
                const updatedData = await updatedResponse.json();
                setNotasEditables(updatedData.notas?.filter(nota => nota.evaluacion === tipoEvaluacionSeleccionado) || []);
                setAsistenciasEditables(updatedData.asistencias || []);
                
                // Resetear el formulario y cerrarlo
                setNuevaAsistencia({
                    fecha: new Date().toISOString().slice(0, 16),
                    sesion: '',
                    estado_asistencia: 'Presente'
                });
                setMostrarFormularioNuevaAsistencia(false);
                
                alert('Nueva asistencia agregada exitosamente!');
            } else {
                alert('Por favor complete todos los campos requeridos');
            }
        } catch (error) {
            console.error('Error al agregar nueva asistencia:', error);
            alert('Error al agregar la nueva asistencia');
        }
    };

    // Formatear fecha para mostrarla en inputs tipo datetime-local
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    return (
        <Container fluid className='d-flex justify-content-center align-items-center min-vh-100 p-0 m-0'>
            <div className='p-4 rounded shadow formulario bloque-log'>
                <Row>
                    <Col>
                        <h3 className='bienvenida'>Editar Datos del Alumno</h3>
                        {alumnoData && (
                            <p className="text-muted textos">
                                <strong>Editando:</strong> {alumnoData.nombre} {alumnoData.apellido} (CI: {alumnoData.ci})
                            </p>
                        )}
                    </Col>
                </Row>

                <div className=''>
                    {/* Sección de Notas */}
                    <div className='mb-4 border-bottom pb-3'>
                        <h4 className='mb-3 textos'>Notas</h4>
                        
                        {/* Selector de tipo de evaluación */}
                        <Form.Group className="mb-3 textos" controlId="formEvaluacion">
                            <Form.Label>Tipo de Evaluación</Form.Label>
                            <Form.Select
                                value={tipoEvaluacionSeleccionado}
                                onChange={handleEvaluacionChange}
                                required
                                className="input-rectangulo"
                            >
                                <option value="Parcial">Parcial</option>
                                <option value="Trabajo">Trabajo</option>
                                <option value="Final">Final</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Lista de notas existentes */}
                        {notasEditables.length > 0 ? (
                            <div className="mb-4">
                                <h5 className='textos'>Notas existentes:</h5>
                                {notasEditables.map((nota, index) => (
                                    <div key={`nota-${index}`} className="mb-3 p-3 border rounded">
                                        <Form.Group className="mb-2 textos">
                                            <Form.Label>Descripción</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={nota.tipo_evaluacion}
                                                onChange={(e) => handleNotaExistenteChange(index, 'tipo_evaluacion', e.target.value)}
                                                required
                                                className="input-rectangulo"
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-2 textos">
                                            <Form.Label>Calificación (0-100)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={nota.calificacion}
                                                onChange={(e) => handleNotaExistenteChange(index, 'calificacion', e.target.value)}
                                                min="0"
                                                max="100"
                                                required
                                                className="input-rectangulo"
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-2 textos">
                                            <Form.Label>Fecha</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={formatDateForInput(nota.fecha)}
                                                onChange={(e) => handleNotaExistenteChange(index, 'fecha', e.target.value)}
                                                required
                                                className="input-rectangulo"
                                            />
                                        </Form.Group>
                                    </div>
                                ))}
                                <div className="d-flex justify-content-center">
                                    <Button 
                                        type="button"
                                        className='m-1 boton-carta-verde'
                                        variant="outline-success" 
                                        onClick={handleActualizarNotas}
                                    >
                                        Actualizar Notas
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Row className="mb-4 justify-content-center">
                                <Col md={8} className="text-center p-3 border rounded">
                                    <h5 className="text-muted textos">No hay notas registradas</h5>
                                    <p className='textos'>No se encontraron notas para evaluación tipo "{tipoEvaluacionSeleccionado}"</p>
                                </Col>
                            </Row>
                        )}

                        {/* Botón para agregar nueva nota */}
                        <div className="mb-3 text-center">
                            <Button 
                                variant="outline-primary"
                                onClick={() => setMostrarFormularioNuevaNota(!mostrarFormularioNuevaNota)}
                                className="mb-3"
                            >
                                {mostrarFormularioNuevaNota ? 'Ocultar formulario' : 'Agregar nueva nota'}
                            </Button>
                        </div>

                        {/* Formulario para agregar nueva nota (desplegable) */}
                        {mostrarFormularioNuevaNota && (
                            <div className="mb-4 p-3 border rounded bg-light">
                                <h5 className='text-center'>Agregar nueva nota</h5>
                                <Form onSubmit={handleSubmitNuevaNota}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tipo de Evaluación</Form.Label>
                                        <Form.Select
                                            name="evaluacion"
                                            value={nuevaNota.evaluacion}
                                            onChange={handleNuevaNotaChange}
                                            required
                                            className="input-rectangulo"
                                        >
                                            <option value="Parcial">Parcial</option>
                                            <option value="Trabajo">Trabajo</option>
                                            <option value="Final">Final</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="tipo_evaluacion"
                                            value={nuevaNota.tipo_evaluacion}
                                            onChange={handleNuevaNotaChange}
                                            required
                                            placeholder="Ej: Examen de Matemáticas, Proyecto Final, etc."
                                            className="input-rectangulo"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Calificación (0-100)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="calificacion"
                                            value={nuevaNota.calificacion}
                                            onChange={handleNuevaNotaChange}
                                            min="0"
                                            max="100"
                                            required
                                            placeholder="Ingrese la nota (0-100)"
                                            className="input-rectangulo"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Fecha</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="fecha"
                                            value={nuevaNota.fecha}
                                            onChange={handleNuevaNotaChange}
                                            required
                                            className="input-rectangulo"
                                        />
                                    </Form.Group>

                                    <div className="d-flex justify-content-center">
                                        <Button 
                                            type="submit"
                                            className='m-1 boton-carta-verde'
                                            variant="outline-success"
                                        >
                                            Agregar nota
                                        </Button>
                                        <Button 
                                            type="button"
                                            className='m-1 boton-carta-roja'
                                            variant="outline-danger"
                                            onClick={() => setMostrarFormularioNuevaNota(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        )}
                    </div>

                    {/* Sección de Asistencias */}
                    <div className='mb-4'>
                        <h4 className='mb-3 textos'>Asistencias</h4>
                        
                        {/* Botón para agregar nueva asistencia */}
                        <div className="mb-3 text-center">
                            <Button 
                                variant="outline-primary"
                                onClick={() => setMostrarFormularioNuevaAsistencia(!mostrarFormularioNuevaAsistencia)}
                                className="mb-3"
                            >
                                {mostrarFormularioNuevaAsistencia ? 'Ocultar formulario' : 'Agregar nueva asistencia'}
                            </Button>
                        </div>

                        {/* Formulario para agregar nueva asistencia (desplegable) */}
                        {mostrarFormularioNuevaAsistencia && (
                            <div className="mb-4 p-3 border rounded bg-light">
                                <h5 className='text-center'>Agregar nueva asistencia</h5>
                                <Form onSubmit={handleSubmitNuevaAsistencia}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Fecha</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="fecha"
                                            value={nuevaAsistencia.fecha}
                                            onChange={handleNuevaAsistenciaChange}
                                            required
                                            className="input-rectangulo"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Sesión</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="sesion"
                                            value={nuevaAsistencia.sesion}
                                            onChange={handleNuevaAsistenciaChange}
                                            required
                                            placeholder="Ej: Clase teórica, Laboratorio, etc."
                                            className="input-rectangulo"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Estado</Form.Label>
                                        <div className="d-flex justify-content-around">
                                            {['Presente', 'Ausente', 'Justificado'].map((opcion) => (
                                                <Form.Check
                                                    key={`nueva-asistencia-${opcion}`}
                                                    type="radio"
                                                    id={`nueva-asistencia-${opcion}`}
                                                    label={opcion}
                                                    name="estado_asistencia"
                                                    value={opcion}
                                                    checked={nuevaAsistencia.estado_asistencia === opcion}
                                                    onChange={handleNuevaAsistenciaChange}
                                                    inline
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>

                                    <div className="d-flex justify-content-center">
                                        <Button 
                                            type="submit"
                                            className='m-1 boton-carta-verde'
                                            variant="outline-success"
                                        >
                                            Agregar asistencia
                                        </Button>
                                        <Button 
                                            type="button"
                                            className='m-1 boton-carta-roja'
                                            variant="outline-danger"
                                            onClick={() => setMostrarFormularioNuevaAsistencia(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        )}

                        {/* Lista de asistencias existentes */}
                        {asistenciasEditables.length > 0 ? (
                            <div className="mb-4">
                                <h5 className='textos'>Registros de asistencia:</h5>
                                {asistenciasEditables.map((asistencia, index) => (
                                    <div key={`asistencia-${index}`} className="mb-3 p-3 border rounded">
                                        <Form.Group className="mb-2 textos">
                                            <Form.Label>Fecha</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={formatDateForInput(asistencia.fecha)}
                                                onChange={(e) => handleAsistenciaChange(index, 'fecha', e.target.value)}
                                                required
                                                className="input-rectangulo"
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-2 textos">
                                            <Form.Label>Sesión</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={asistencia.sesion}
                                                onChange={(e) => handleAsistenciaChange(index, 'sesion', e.target.value)}
                                                required
                                                className="input-rectangulo"
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className='textos'>
                                            <Form.Label>Estado</Form.Label>
                                            <div className="d-flex justify-content-around">
                                                {['Presente', 'Ausente', 'Justificado'].map((opcion) => (
                                                    <Form.Check
                                                        key={`asistencia-estado-${opcion}-${index}`}
                                                        type="radio"
                                                        id={`asistencia-estado-${index}-${opcion}`}
                                                        label={opcion}
                                                        name={`asistencia-estado-${index}`}
                                                        value={opcion}
                                                        checked={asistencia.estado_asistencia === opcion}
                                                        onChange={() => handleAsistenciaChange(index, 'estado_asistencia', opcion)}
                                                        inline
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>
                                    </div>
                                ))}
                                <div className="d-flex justify-content-center">
                                    <Button 
                                        type="button"
                                        className='m-1 boton-carta-verde'
                                        variant="outline-success" 
                                        onClick={handleActualizarAsistencias}
                                    >
                                        Actualizar Asistencias
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Row className="mb-4 justify-content-center">
                                <Col md={8} className="text-center p-3 border rounded">
                                    <h5 className="text-muted textos">No hay registros de asistencia</h5>
                                    <p className='textos'>No se encontraron asistencias registradas para este alumno</p>
                                </Col>
                            </Row>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Formulario;
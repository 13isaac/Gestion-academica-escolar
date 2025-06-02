import '../styles/Formulario.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Profesor from '../assets/profesor.png'
import Navegador from '../components/Navegador'

export const Formulario = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const id_alumno = searchParams.get('id_alumno')
    const id_curso = searchParams.get('id_curso')
    
    // Estados para datos y carga
    const [alumnoData, setAlumnoData] = useState(null)
    const [cursoData, setCursoData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // Estados para formularios
    const [tipoEvaluacionSeleccionado, setTipoEvaluacionSeleccionado] = useState('Parcial')
    const [notasEditables, setNotasEditables] = useState([])
    const [asistenciasEditables, setAsistenciasEditables] = useState([])
    const [nuevaNota, setNuevaNota] = useState({
        evaluacion: 'Parcial',
        tipo_evaluacion: '',
        calificacion: '',
        fecha: new Date().toISOString().slice(0, 16)
    })
    const [nuevaAsistencia, setNuevaAsistencia] = useState({
        fecha: new Date().toISOString().slice(0, 16),
        sesion: '',
        estado_asistencia: 'Presente'
    })
    const [mostrarFormularioNuevaNota, setMostrarFormularioNuevaNota] = useState(false)
    const [mostrarFormularioNuevaAsistencia, setMostrarFormularioNuevaAsistencia] = useState(false)

    // Función para hacer peticiones autorizadas
    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/')
            throw new Error('No autenticado')
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 401) {
                localStorage.removeItem('token')
                navigate('/')
                throw new Error('Sesión expirada')
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error en la solicitud')
            }

            return await response.json()
        } catch (err) {
            setError(err.message)
            throw err
        }
    }

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)
                
                const [alumnoResponse, cursoResponse] = await Promise.all([
                    fetchWithAuth(`http://127.0.0.1:5000/api/alumnos/${id_alumno}`),
                    fetchWithAuth(`http://127.0.0.1:5000/api/notas/cursos/${id_curso}/alumnos/${id_alumno}`)
                ])

                setAlumnoData(alumnoResponse)
                setCursoData(cursoResponse)
                
                // Filtrar notas según el tipo de evaluación seleccionado
                const notasFiltradas = cursoResponse.notas?.filter(nota => nota.evaluacion === tipoEvaluacionSeleccionado) || []
                setNotasEditables(notasFiltradas)
                setAsistenciasEditables(cursoResponse.asistencias || [])
                
            } catch (err) {
                console.error("Error cargando datos:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [id_alumno, id_curso, navigate, tipoEvaluacionSeleccionado])

    // Manejadores de cambios
    const handleEvaluacionChange = (e) => {
        const value = e.target.value
        setTipoEvaluacionSeleccionado(value)
        setNuevaNota(prev => ({ ...prev, evaluacion: value }))
        
        // Filtrar notas cuando cambia el tipo de evaluación
        if (cursoData) {
            const notasFiltradas = cursoData.notas?.filter(nota => nota.evaluacion === value) || []
            setNotasEditables(notasFiltradas)
        }
    }

    const handleNotaExistenteChange = (index, field, value) => {
        const updatedNotas = [...notasEditables]
        
        if (field === 'calificacion') {
            value = value.replace(/[^0-9]/g, '')
            if (value !== '' && (parseInt(value) < 0 || parseInt(value) > 100)) {
                return
            }
        }
        
        updatedNotas[index][field] = value
        setNotasEditables(updatedNotas)
    }

    const handleAsistenciaChange = (index, field, value) => {
        const updatedAsistencias = [...asistenciasEditables]
        updatedAsistencias[index][field] = value
        setAsistenciasEditables(updatedAsistencias)
    }

    const handleNuevaNotaChange = (e) => {
        const { name, value } = e.target
        
        if (name === 'calificacion') {
            let val = value.replace(/[^0-9]/g, '')
            if (val !== '' && (parseInt(val) < 0 || parseInt(val) > 100)) {
                return
            }
            setNuevaNota(prev => ({ ...prev, [name]: val }))
        } else {
            setNuevaNota(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleNuevaAsistenciaChange = (e) => {
        const { name, value } = e.target
        setNuevaAsistencia(prev => ({ ...prev, [name]: value }))
    }

    // Funciones para enviar datos
    const handleActualizarNotas = async () => {
        try {
            setLoading(true)
            
            for (const nota of notasEditables) {
                await fetchWithAuth(`http://127.0.0.1:5000/api/notas/${nota.id_nota}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        id_alumno: id_alumno,
                        id_curso: id_curso,
                        evaluacion: nota.evaluacion,
                        tipo_evaluacion: nota.tipo_evaluacion,
                        calificacion: parseFloat(nota.calificacion),
                        fecha: nota.fecha
                    })
                })
            }
            
            alert('Notas actualizadas exitosamente!')
        } catch (error) {
            console.error('Error al actualizar notas:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleActualizarAsistencias = async () => {
        try {
            setLoading(true)
            
            for (const asistencia of asistenciasEditables) {
                await fetchWithAuth(`http://127.0.0.1:5000/api/asistencias/${asistencia.id_asistencia}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        id_alumno: id_alumno,
                        id_curso: id_curso,
                        fecha: asistencia.fecha,
                        sesion: asistencia.sesion,
                        estado_asistencia: asistencia.estado_asistencia
                    })
                })
            }
            
            alert('Asistencias actualizadas exitosamente!')
        } catch (error) {
            console.error('Error al actualizar asistencias:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitNuevaNota = async (e) => {
        e.preventDefault()
        
        try {
            setLoading(true)
            
            if (nuevaNota.calificacion && nuevaNota.tipo_evaluacion && nuevaNota.fecha) {
                await fetchWithAuth(`http://127.0.0.1:5000/api/notas`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id_alumno: id_alumno,
                        id_curso: id_curso,
                        evaluacion: nuevaNota.evaluacion,
                        tipo_evaluacion: nuevaNota.tipo_evaluacion,
                        calificacion: parseFloat(nuevaNota.calificacion),
                        fecha: nuevaNota.fecha
                    })
                })
                
                // Recargar datos
                const updatedData = await fetchWithAuth(`http://127.0.0.1:5000/api/notas/cursos/${id_curso}/alumnos/${id_alumno}`)
                setCursoData(updatedData)
                const notasFiltradas = updatedData.notas?.filter(nota => nota.evaluacion === tipoEvaluacionSeleccionado) || []
                setNotasEditables(notasFiltradas)
                
                // Resetear formulario
                setNuevaNota({
                    evaluacion: tipoEvaluacionSeleccionado,
                    tipo_evaluacion: '',
                    calificacion: '',
                    fecha: new Date().toISOString().slice(0, 16)
                })
                setMostrarFormularioNuevaNota(false)
                
                alert('Nueva nota agregada exitosamente!')
            } else {
                alert('Por favor complete todos los campos requeridos')
            }
        } catch (error) {
            console.error('Error al agregar nueva nota:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitNuevaAsistencia = async (e) => {
        e.preventDefault()
        
        try {
            setLoading(true)
            
            if (nuevaAsistencia.sesion && nuevaAsistencia.fecha && nuevaAsistencia.estado_asistencia) {
                await fetchWithAuth(`http://127.0.0.1:5000/api/asistencias`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id_alumno: id_alumno,
                        id_curso: id_curso,
                        fecha: nuevaAsistencia.fecha,
                        sesion: nuevaAsistencia.sesion,
                        estado_asistencia: nuevaAsistencia.estado_asistencia
                    })
                })
                
                // Recargar datos
                const updatedData = await fetchWithAuth(`http://127.0.0.1:5000/api/notas/cursos/${id_curso}/alumnos/${id_alumno}`)
                setCursoData(updatedData)
                setAsistenciasEditables(updatedData.asistencias || [])
                
                // Resetear formulario
                setNuevaAsistencia({
                    fecha: new Date().toISOString().slice(0, 16),
                    sesion: '',
                    estado_asistencia: 'Presente'
                })
                setMostrarFormularioNuevaAsistencia(false)
                
                alert('Nueva asistencia agregada exitosamente!')
            } else {
                alert('Por favor complete todos los campos requeridos')
            }
        } catch (error) {
            console.error('Error al agregar nueva asistencia:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    // Formatear fecha para inputs
    const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
    }

    // Mostrar estados de carga y error
    if (loading && !alumnoData) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p>Cargando datos del alumno...</p>
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button onClick={() => window.location.reload()}>Reintentar</Button>
                    <Button variant="secondary" onClick={() => navigate('/perfil')} className="ms-2">
                        Volver al perfil
                    </Button>
                </Alert>
            </Container>
        )
    }

    if (!alumnoData || !cursoData) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    No se encontraron datos para mostrar
                </Alert>
            </Container>
        )
    }

    return (
        <>
            <Navegador icono={Profesor} user={alumnoData.nombre}/>
            <Container fluid className='d-flex justify-content-center align-items-center min-vh-100 p-0 m-0 container-margin'>
            <div className='p-4 rounded shadow formulario bloque-log'>
                <Row>
                    <Col>
                        <h3 className='bienvenida'>Editar Datos del Alumno</h3>
                        <p className="text-muted textos">
                            <strong>Editando:</strong> {alumnoData.nombre} {alumnoData.apellido} (CI: {alumnoData.ci})
                        </p>
                    </Col>
                </Row>

                <div className=''>
                    {/* Sección de Notas */}
                    <div className='mb-4 border-bottom pb-3'>
                        <h4 className='mb-3 textos'>Notas</h4>
                        
                        <Form.Group className="mb-3 textos" controlId="formEvaluacion">
                            <Form.Label>Tipo de Evaluación</Form.Label>
                            <Form.Select
                                value={tipoEvaluacionSeleccionado}
                                onChange={handleEvaluacionChange}
                                required
                                className="input-rectangulo"
                                disabled={loading}
                            >
                                <option value="Parcial">Parcial</option>
                                <option value="Trabajo">Trabajo</option>
                                <option value="Final">Final</option>
                            </Form.Select>
                        </Form.Group>

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
                                                disabled={loading}
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
                                                disabled={loading}
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
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </div>
                                ))}
                                <div className="d-flex justify-content-center">
                                    <Button 
                                        variant="success"
                                        onClick={handleActualizarNotas}
                                        disabled={loading}
                                    >
                                        {loading ? 'Actualizando...' : 'Actualizar Notas'}
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

                        <div className="mb-3 text-center">
                            <Button 
                                variant="primary"
                                onClick={() => setMostrarFormularioNuevaNota(!mostrarFormularioNuevaNota)}
                                className="mb-3"
                                disabled={loading}
                            >
                                {mostrarFormularioNuevaNota ? 'Ocultar formulario' : 'Agregar nueva nota'}
                            </Button>
                        </div>

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
                                            disabled={loading}
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
                                            disabled={loading}
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
                                            disabled={loading}
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
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <div className="d-flex justify-content-center">
                                        <Button 
                                            type="submit"
                                            variant="success"
                                            disabled={loading}
                                        >
                                            {loading ? 'Agregando...' : 'Agregar nota'}
                                        </Button>
                                        <Button 
                                            type="button"
                                            variant="danger"
                                            onClick={() => setMostrarFormularioNuevaNota(false)}
                                            className="ms-2"
                                            disabled={loading}
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
                        
                        <div className="mb-3 text-center">
                            <Button 
                                variant="primary"
                                onClick={() => setMostrarFormularioNuevaAsistencia(!mostrarFormularioNuevaAsistencia)}
                                className="mb-3"
                                disabled={loading}
                            >
                                {mostrarFormularioNuevaAsistencia ? 'Ocultar formulario' : 'Agregar nueva asistencia'}
                            </Button>
                        </div>

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
                                            disabled={loading}
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
                                            disabled={loading}
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
                                                    disabled={loading}
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>

                                    <div className="d-flex justify-content-center">
                                        <Button 
                                            type="submit"
                                            variant="success"
                                            disabled={loading}
                                        >
                                            {loading ? 'Agregando...' : 'Agregar asistencia'}
                                        </Button>
                                        <Button 
                                            type="button"
                                            variant="danger"
                                            onClick={() => setMostrarFormularioNuevaAsistencia(false)}
                                            className="ms-2"
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        )}

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
                                                disabled={loading}
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
                                                disabled={loading}
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
                                                        disabled={loading}
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>
                                    </div>
                                ))}
                                <div className="d-flex justify-content-center">
                                    <Button 
                                        variant="success"
                                        onClick={handleActualizarAsistencias}
                                        disabled={loading}
                                    >
                                        {loading ? 'Actualizando...' : 'Actualizar Asistencias'}
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
        </>
    )
}

export default Formulario
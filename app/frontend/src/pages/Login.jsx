import '../styles/login.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import escuela from '../assets/escuela.png'
import { Boton } from '../components/Boton'
import Form from 'react-bootstrap/Form'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/uselogin'


export const Login = () => {
    //campos del formulario
    const [usuario, setUsuario] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [error, setError] = useState(null)

    //Hook para redireccionar
    const navigate = useNavigate()
    const { login, loading, error: loginError } = useLogin()

    //Funcion enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = await login(usuario, contraseña)
        if(data){
            setError(null)
            navigate('/perfil')
        } else {
            setError('Credenciales incorrectas. Intenta de nuevo.')

            //Limpiar los campos
            //setUsuario('')
            //setContraseña('')
        }
    }

return (
    <Container fluid className='d-flex justify-content-center align-items-center min-vh-100 p-0 m-0'>
      <div className='bloque-login p-4 rounded shadow text-center'>
        <Row>
          <Col>
            <h3 className='bienvenida'>Bienvenido</h3>
            <h1 className='iniciar-sesion'>Iniciar Sesión</h1>
            <img src={escuela} alt="Logo" className="logo" />
          </Col>
        </Row>

        <Form className="mt-4" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsuario">
            <Form.Control
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              placeholder="Ingrese su usuario"
              className="input-rectangulo"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Control
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              placeholder="Ingrese su contraseña"
              className="input-rectangulo"
            />
          </Form.Group>

          <Boton texto={loading ? "Cargando..." :"Acceder"}
          variant="primary" type="submit" className="w-100"></Boton>

          {error && <p className="mt-3 text-danger">{error}</p>}
        </Form>
      </div>
    </Container>
  )
}

export default Login
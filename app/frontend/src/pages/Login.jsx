import '../styles/login.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import escuela from '../assets/escuela.png'
import { Boton } from '../components/Boton'
import Form from 'react-bootstrap/Form'

export const Login = () => {
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
                <Form className="mt-4">
                    <Form.Group className="mb-3" controlId="formUsuario">
                        <Form.Control type="text" placeholder="Usuario" className="input-rectangulo"/>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formPassword">
                        <Form.Control type="password" placeholder="Contraseña" className="input-rectangulo"/>
                    </Form.Group>

                    <div className='mt-5'>
                        <Boton texto="Iniciar Sesion"/>
                    </div>
                </Form>
            </div>
        </Container>  
    )
}
export default Login
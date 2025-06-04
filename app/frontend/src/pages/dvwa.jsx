import React, { useState } from "react";
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import '../styles/dvwa.css';
import escuela from '../assets/escuela.png'

export default function LoginDVWA() {
  const [nivel, setNivel] = useState("low");
  const [nombre_usuario, setUsuario] = useState("");
  const [contraseña, setPassword] = useState("");
  const [respuesta, setRespuesta] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuesta(null);

    try {
      const res = await fetch(`http://localhost:5000/api/login_${nivel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_usuario: nombre_usuario, contraseña: contraseña }),
      });

      const data = await res.json();   
      setRespuesta(data);
    } catch (error) {
      setRespuesta({ error: error.message });
    }
  };

  return (
    <Container fluid className="dvwa-container">
      <Row className="h-100">
        <Col md={6} className="left-column">
          <div className="login p-4">
            <h3 className="pruebas">Pruebas DVWA</h3>
            <h1 className="textNivel">Nivel {nivel.toUpperCase()}</h1>
            
            <Form onSubmit={handleSubmit} className="mt-4">
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  value={nombre_usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  placeholder="Ingrese su usuario"
                  className="input-rectangulo"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  value={contraseña}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="input-rectangulo"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="input-rectangulo"
                >
                  <option value="low">Nivel LOW</option>
                  <option value="medium">Nivel MEDIUM</option>
                  <option value="high">Nivel HIGH</option>
                </Form.Select>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 custom-button"
              >
                Probar vulnerabilidad
              </Button>
            </Form>
          </div>
        </Col>

        <Col md={6} className="right-column">
          <Card className="bloque-respuesta h-100">
            <Card.Header className="respuesta-header">
              <h3 className="pruebas">Respuesta del Servidor</h3>
            </Card.Header>
            <Card.Body className="respuesta-body">
              {respuesta ? (
                <pre className="respuesta-pre">
                  {JSON.stringify(respuesta, null, 2)}
                </pre>
              ) : (
                <div className="text-center mt-5">
                  <p className="placeholder-text">Realice una prueba para ver los resultados</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
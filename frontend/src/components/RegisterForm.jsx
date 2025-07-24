import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const RegisterForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Registrando:\n${nombre} ${apellido}\n${email}`);
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: 500 }} className="p-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Registrate</Card.Title>
          <Form onSubmit={handleRegister}>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Registrarse
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterForm;

import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Iniciando sesión con:\nEmail: ${email}\nContraseña: ${password}`);
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: 400 }} className="p-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Inicia sesión</Card.Title>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresá tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Iniciar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;

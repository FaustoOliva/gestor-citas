import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { logInUser } from '../services/auth.js';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate('/pacient');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const credentials = { email, password };
    try {
      const data = await logInUser(credentials); // Llama al servicio de autenticación
      // Simular un retraso para ver el spinner
      setTimeout(() => {
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }
        if (data.user) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        setIsLoading(false);
        if (data.user?.EsAdmin){
          navigate('/admin');
        } else {
          navigate('/pacient');
        }
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Error en el inicio de sesión. Por favor, revisa tus credenciales.');
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: 400 }} className="p-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Inicia sesión</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>} {/* Mostrar error */}
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

            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : 'Iniciar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;

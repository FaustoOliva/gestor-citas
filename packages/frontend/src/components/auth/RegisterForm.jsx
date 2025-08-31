import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { registerUser, sendMailConfirmation } from "../../services/auth.js";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const RegisterForm = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    const user = { nombre, apellido, email, password, phone };
    try {
      var data = await registerUser(user);
      if (data.error) {
        setError(data.error);
        return;
      }
      data = await sendMailConfirmation(email);
      if (data.error) {
        setError(data.error);
        return;
      }
      setTimeout(() => {
        setIsLoading(false);

        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem(
          "currentUser",
          JSON.stringify(userWithoutPassword),
        );
        if (data.error) {
          setError(data.error);
          return;
        }
        navigate("/verification");
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.message || "Error al registrarse. Por favor, intenta nuevamente.",
      );
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "100%", maxWidth: 500 }} className="p-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Registrate</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
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

            <Form.Group className="mb-3" controlId="registerPhone">
              <Form.Control
                type="phone"
                placeholder="Número telefonico"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Registrarse"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterForm;

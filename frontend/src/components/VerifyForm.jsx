import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/auth';

const VerifyForm = () => {
    const [code, setCode] = useState(new Array(6).fill(""));
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }
        if (!userData) {
            navigate('/login'); // Redirigir si no hay usuario actual
        }
    }, []);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) {
            setError('Por favor, ingresá solo números.');
            return;
        }
        const updated = [...code];
        updated[index] = value;
        setCode(updated);

        if (value) {
            // Mueve el foco al siguiente input si se ingresó un dígito
            const next = document.getElementById(`digit-${index + 1}`);
            if (next) next.focus();
        } else if (!value && index > 0) {
            // Mueve el foco al input anterior si se borra un dígito
            const prev = document.getElementById(`digit-${index - 1}`);
            if (prev) prev.focus();
        }
    };

    // const handleKeyDown = (e, index) => {
    //     if (e.key === 'ArrowRight' && index < 5) {
    //         const next = document.getElementById(`digit-${index + 1}`);
    //         if (next) {
    //             next.focus();
    //             handleFocus(e);
    //         }
    //     } else if (e.key === 'ArrowLeft' && index > 0) {
    //         const prev = document.getElementById(`digit-${index - 1}`);
    //         if (prev) {
    //             prev.focus();
    //             handleFocus(e);
    //         }
    //     }
    // };

    const handleFocus = (e) => {
        e.target.select();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const finalCode = code.join("");
        if (finalCode.length < 6) {
            setError('Por favor, completa todos los dígitos del código.');
            setIsLoading(false);
            return;
        }
        try {
            const response = await verifyEmail(currentUser.email, finalCode);

            setTimeout(() => {
                if (response.error) {
                    setCode(new Array(6).fill(""));
                    document.getElementById('digit-0').focus();
                    setError(response.error);
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                navigate('/pacient');
            }, 1000);
        } catch (err) {
            setError(err.message || 'Error al verificar el código. Por favor, intenta nuevamente.');
            setCode(new Array(6).fill(""));
            document.getElementById('digit-0').focus();
            setIsLoading(false);
        }

    };

    return (
        <div className="d-flex justify-content-center">
            <Card className="p-4 shadow-sm" style={{ maxWidth: 400, width: "100%" }}>
                <Card.Body>
                    <Card.Title className="mb-3">Verificación de correo</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Control
                                type="text"
                                value={currentUser ? currentUser.email : ''}
                                readOnly
                                className="text-center"
                                style={{ backgroundColor: "#ccc" }}
                            />
                        </Form.Group>

                        <Row className="justify-content-center mb-3">
                            {code.map((digit, index) => (
                                <Col key={index} xs={2} className="px-1">
                                    <Form.Control
                                        type="text"
                                        id={`digit-${index}`}
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        //onKeyDown={(e) => handleKeyDown(e, index)}
                                        onFocus={handleFocus}
                                        className="text-center fs-4"
                                        style={{ caretColor: 'transparent' }} 
                                    />
                                </Col>
                            ))}
                        </Row>

                        <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Verificar'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default VerifyForm;

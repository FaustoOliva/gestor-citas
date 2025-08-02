import React, { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/auth';

const VerifyForm = ({ email = "usuario@email.com" }) => {
    const [code, setCode] = useState(new Array(6).fill(""));
    const navigate = useNavigate();

    const handleVerifyRedirect = () => {
        navigate('/pacient');
    }

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return; // solo dígitos
        const updated = [...code];
        updated[index] = value;
        setCode(updated);

        // foco al siguiente input si se ingresó un dígito
        const next = document.getElementById(`digit-${index + 1}`);
        if (value && next) next.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCode = code.join("");
        alert(`Código ingresado: ${finalCode}`);
        // Aquí harías la llamada al backend
        verifyEmail({ email, code: finalCode })
            .then(response => {
                alert(`Verificación exitosa: ${response.message}`);
                handleVerifyRedirect();
            })
            .catch(error => {
                alert(`Error en la verificación: ${error.message}`);
            });

    };

    return (
        <div className="d-flex justify-content-center">
            <Card className="p-4 shadow-sm" style={{ maxWidth: 400, width: "100%" }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Control
                            type="text"
                            value={email}
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
                                    className="text-center fs-4"
                                />
                            </Col>
                        ))}
                    </Row>

                    <Button type="submit" variant="primary" className="w-100">
                        Verificar
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default VerifyForm;

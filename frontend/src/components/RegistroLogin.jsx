import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { registrarPaciente } from '../services/registroPaciente';

function RegistroLogin({ onLogin }) {
    const [modo, setModo] = useState('login'); // 'login' o 'registro'
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const obtenerPacientes = () => {
        const data = localStorage.getItem('pacientes');
        return data ? JSON.parse(data) : [];
    };

    const guardarPacientes = (lista) => {
        localStorage.setItem('pacientes', JSON.stringify(lista));
    };

    async  function handleSubmit (e) {
        e.preventDefault();
        setError('');

        const pacientes = obtenerPacientes();

        if (modo === 'registro') {
            if (!nombre || !email || !password) {
                setError('Todos los campos son obligatorios.');
                return;
            }

            try {
                const nuevoPaciente = {
                    id: crypto.randomUUID(),
                    nombre,
                    email,
                    password
                };

                await registrarPaciente(nuevoPaciente);
                localStorage.setItem('paciente_id', nuevoPaciente.id);
                localStorage.setItem('paciente_nombre', nuevoPaciente.nombre);
                onLogin(nuevoPaciente.id, nuevoPaciente.nombre);
            } catch (err) {
                setError(err.message);
            }
        }


        if (modo === 'login') {
            // Si es admin
            if (email === 'admin@citas.com' && password === 'admin123') {
                onLogin('admin', 'Admin');
                return;
            }

            const encontrado = pacientes.find(p => p.email === email && p.password === password);
            if (!encontrado) {
                setError('Credenciales inválidas.');
                return;
            }

            localStorage.setItem('paciente_id', encontrado.id);
            localStorage.setItem('paciente_nombre', encontrado.nombre);
            onLogin(encontrado.id, encontrado.nombre);
        }
    };

    return (
        <div className="text-center my-4">
            <h3>{modo === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h3>

            {error && <p className="text-danger">{error}</p>}

            <Form onSubmit={handleSubmit} className="w-50 mx-auto text-start">
                {modo === 'registro' && (
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </Form.Group>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {modo === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                </Button>
            </Form>

            <div className="mt-3">
                {modo === 'login' ? (
                    <p>
                        ¿No tenés cuenta?{' '}
                        <Button variant="link" onClick={() => setModo('registro')}>
                            Registrarse
                        </Button>
                    </p>
                ) : (
                    <p>
                        ¿Ya tenés cuenta?{' '}
                        <Button variant="link" onClick={() => setModo('login')}>
                            Iniciar sesión
                        </Button>
                    </p>
                )}
            </div>
        </div>
    );
}

export default RegistroLogin;

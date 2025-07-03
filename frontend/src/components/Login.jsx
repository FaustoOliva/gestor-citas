import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

function Login({ onLogin }) {
  const [nombrePaciente, setNombrePaciente] = useState('');

  const ingresarComoPaciente = () => {
    if (!nombrePaciente.trim()) return;

    const idUsuario = crypto.randomUUID();
    const nombre = nombrePaciente.trim();

    // Guardar en localStorage
    localStorage.setItem('paciente_id', idUsuario);
    localStorage.setItem('paciente_nombre', nombre);

    onLogin(idUsuario, nombre);
  };

  return (
    <div className="text-center my-4">
      <h3>Ingresá como:</h3>
      <Button variant="secondary" onClick={() => onLogin('admin', 'Admin')}>
        Admin
      </Button>

      <div className="mt-4">
        <p>O ingresá como paciente</p>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombrePaciente}
          onChange={(e) => setNombrePaciente(e.target.value)}
          className="form-control w-50 mx-auto mb-2"
        />
        <Button variant="primary" onClick={ingresarComoPaciente}>
          Entrar como paciente
        </Button>
      </div>
    </div>
  );
}

export default Login;

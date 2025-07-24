import React from 'react';
import LoginForm from '../components/LogInForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="py-5">
      <h1 className="text-center mb-4">Iniciar sesión</h1>
      <p className="text-center mb-4">
        Inicia sesión para acceder a tu cuenta, agendar citas y controlar el historial de tus mascotas.
      </p>
      <LoginForm />
      <div className="text-center mt-3">
        <p>
          ¿No tenés cuenta?{' '}
          <button className="btn btn-link" onClick={() => navigate('/register')}>
            Registrate
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

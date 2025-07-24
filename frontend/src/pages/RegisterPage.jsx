import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {  
  const navigate = useNavigate();

  return (
    <div className="py-5">
      <h1 className="text-center mb-4">Registrarse</h1>
      <p className="text-center mb-4">
        Registrate para poder agendar citas, controlar el historial de tus mascotas, y mucho más!
      </p>
      <RegisterForm />
      <div className="text-center mt-3">
      <p>
          ¿Ya tenés cuenta?{' '}
          <button className="btn btn-link" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
};



export default RegisterPage;

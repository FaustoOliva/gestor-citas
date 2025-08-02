import React, { useState, useEffect } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';

function App() {
  const [listaCitas, setListaCitas] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [nombreVisible, setNombreVisible] = useState('');

  useEffect(() => {
    const citasGuardadas = localStorage.getItem("citas");
    if (citasGuardadas) {
      setListaCitas(JSON.parse(citasGuardadas));
    }

    const id = localStorage.getItem('paciente_id');
    const nombre = localStorage.getItem('paciente_nombre');
    if (id && nombre) {
      setUsuarioActual(id);
      setNombreVisible(nombre);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(listaCitas));
  }, [listaCitas]);

  const cerrarSesion = () => {
    setUsuarioActual(null);
    setNombreVisible('');
    localStorage.removeItem('paciente_id');
    localStorage.removeItem('paciente_nombre');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/pacient" element={
          <Container className="text-center mt-5">
            <h1>Bienvenido, {nombreVisible}</h1>
            <Button variant="danger" onClick={cerrarSesion}>Cerrar sesión</Button>
          </Container>
        } />
      </Routes>
    </Router>
  );
}

export default App;

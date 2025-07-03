import React, { useState, useEffect } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import RegistroLogin from './components/RegistroLogin';
import VistaPaciente from './components/VistaPaciente';
import VistaAdmin from './components/VistaAdmin';

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
    <>
      <div>
        <h1 className="letter">Administrador de pacientes</h1>
      </div>

      <Container>
        {!usuarioActual ? (
          <RegistroLogin
            onLogin={(id, nombre) => {
              setUsuarioActual(id);
              setNombreVisible(nombre);
            }}
          />

        ) : (
          <>
            <div className="text-center my-3">
              <p><strong>Usuario:</strong> {nombreVisible}</p>
              <Button variant="outline-danger" onClick={cerrarSesion}>
                Cerrar sesión
              </Button>
            </div>

            {usuarioActual === 'admin'
              ? <VistaAdmin listaCitas={listaCitas} setListaCitas={setListaCitas} />
              : <VistaPaciente listaCitas={listaCitas} setListaCitas={setListaCitas} idUsuario={usuarioActual} />
            }
          </>
        )}
      </Container>
    </>
  );
}

export default App;

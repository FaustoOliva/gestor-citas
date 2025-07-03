import { useState, useEffect } from 'react';

import './App.css';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import Formulario from './components/Formulario';
import Cita from './components/Cita';
import DashboardAdmin from './components/DashboardAdmin';

function App() {
  const [listaCitas, setListaCitas] = useState([])
  const [usuarioActual, setUsuarioActual] = useState(null); // "paciente" o "admin"
  const [nombrePaciente, setNombrePaciente] = useState(''); // nombre del paciente
  const [nombreVisible, setNombreVisible] = useState(''); // solo para mostrar


  useEffect(() => {
    const data = localStorage.getItem("citas");
    if (data) setListaCitas(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(listaCitas));
  }, [listaCitas]);

  const cerrarSesion = () => {
    setUsuarioActual(null);
  };

  return (
    <>
      <div>
        <h1 className="letter">Administrador de pacientes</h1>
      </div>

      <Container>
        {!usuarioActual ? (
          <div className="text-center my-4">
            <h3>Ingresá como:</h3>
            <Button variant="secondary" onClick={() => setUsuarioActual("admin")}>Admin</Button>

            <div className="mt-4">
              <p>O ingresá como paciente</p>
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombrePaciente}
                onChange={(e) => setNombrePaciente(e.target.value)}
                className="form-control w-50 mx-auto mb-2"
              />
              <Button
                variant="primary"
                onClick={() => {
                  if (nombrePaciente.trim()) {
                    const idUsuario = crypto.randomUUID();
                    setUsuarioActual(idUsuario);
                    setNombreVisible(nombrePaciente.trim());
                  }
                }}
              >
                Entrar como paciente
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center my-3">
              <h3>Bienvenido</h3>
              <p><strong>Usuario:</strong> {usuarioActual === 'admin' ? 'Admin' : nombreVisible}</p>
              <Button variant="outline-danger" onClick={cerrarSesion}>Cerrar sesión</Button>
            </div>

            {usuarioActual === 'admin' ? (
              <Row>
                <Col>
                  <h2>Panel de administrador</h2>
                  <Cita
                    listaCitas={listaCitas.filter(c => c.idUsuario === usuarioActual)}
                    setListaCitas={setListaCitas}
                    usuario={usuarioActual}
                  />
                  <DashboardAdmin listaCitas={listaCitas} />
                </Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <Formulario setListaCitas={setListaCitas} usuario={usuarioActual} />
                </Col>
                <Col>
                  <h2>Mis citas</h2>
                  <Cita
                    listaCitas={listaCitas.filter(c => c.idUsuario === usuarioActual)}
                    setListaCitas={setListaCitas}
                    usuario={usuarioActual}
                  />
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default App;

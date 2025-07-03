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
            <Button variant="primary" onClick={() => setUsuarioActual("paciente")}>Paciente</Button>{' '}
            <Button variant="secondary" onClick={() => setUsuarioActual("admin")}>Admin</Button>
          </div>
        ) : (
          <>
            <div className="text-center my-3">
              <p><strong>Rol:</strong> {usuarioActual}</p>
              <Button variant="outline-danger" onClick={cerrarSesion}>Cerrar sesión</Button>
            </div>

            {usuarioActual === 'paciente' && (
              <Row>
                <Col>
                  <Formulario setListaCitas={setListaCitas} usuario={usuarioActual} />
                </Col>
                <Col>
                  <h2>Mis citas</h2>
                  <Cita
                    listaCitas={listaCitas.filter(c => c.idUsuario === 'paciente')}
                    setListaCitas={setListaCitas}
                    usuario={usuarioActual}
                  />
                </Col>
              </Row>
            )}

            {usuarioActual === 'admin' && (
              <Row>
                <Col>
                  <h2>Panel de administrador</h2>
                  <Cita
                    listaCitas={listaCitas}
                    setListaCitas={setListaCitas}
                    usuario={usuarioActual}
                  />
                  <DashboardAdmin listaCitas={listaCitas} />
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

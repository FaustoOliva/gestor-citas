import { useState, useEffect } from 'react';

import './App.css';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Formulario from './components/Formulario';
import Cita from './components/Cita';

function App() {
  const [listaCitas, setListaCitas] = useState([])

  useEffect(() => {
    const data = localStorage.getItem("citas");
    if (data) setListaCitas(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(listaCitas));
  }, [listaCitas]);

  return (
    <><div>
      <h1 className="letter">Administrador de pacientes</h1>
    </div><Container>
        <Row>
          <Col>
            <Formulario setListaCitas={setListaCitas} />
          </Col>
          <Col>
            <h2>Administra tus citas</h2>
            <Cita listaCitas={listaCitas} setListaCitas={setListaCitas} />
          </Col>
        </Row>
      </Container></>
  )
};

export default App;

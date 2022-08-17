import React, { useState } from 'react';
import './App.css';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Formulario from './components/formulario'
import Cita from './components/cita'

function App() {
  const [listaCitas, setListaCitas] = useState([])


  return (
    <><div>
      <h1 class="letter">Administrador de pacientes</h1>
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

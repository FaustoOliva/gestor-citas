import React, { useState } from 'react';
import './App.css';
import Cita from './components/cita'
import Formulario from './components/formulario'
import Listado from './components/listado-citas'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'


function App() {
  const [cita, setCita] = useState([])

  const addCita = (citaInfo) => {
    setCita([...cita, citaInfo]);
  }
  console.log(cita)
  return (
    <><div>
      <h1 class="hola">Administrador de pacientes</h1>
    </div><Container>
        <Row>
          <Col>
            <Formulario addCita={addCita} />
          </Col>
          <Col>
            <Listado {...cita, setCita} />
          </Col>
        </Row>
      </Container></>
  )
};

export default App;

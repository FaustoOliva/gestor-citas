import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import Cita from './components/cita'
import Error from './components/error'
import Formulario from './components/formulario'
import Listado from './components/listado-citas'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'



function App() {
  return(
    <Container>
      <Row>
        <Col>
          <Formulario/>
        </Col>
        <Col>
          <Cita/>
        </Col>
      </Row>
    </Container>
  )
};

export default App;
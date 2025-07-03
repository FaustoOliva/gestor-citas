import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Formulario from './Formulario';
import Cita from './Cita';

function VistaPaciente({ listaCitas, setListaCitas, idUsuario }) {
  const citasPropias = listaCitas.filter(c => c.idUsuario === idUsuario);

  return (
    <Row>
      <Col>
        <Formulario setListaCitas={setListaCitas} usuario={idUsuario} />
      </Col>
      <Col>
        <h2>Mis citas</h2>
        <Cita
          listaCitas={citasPropias}
          setListaCitas={setListaCitas}
          usuario={idUsuario}
        />
      </Col>
    </Row>
  );
}

export default VistaPaciente;

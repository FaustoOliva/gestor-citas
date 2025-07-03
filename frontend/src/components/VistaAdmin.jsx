import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cita from './Cita';
import DashboardAdmin from './DashboardAdmin';

function VistaAdmin({ listaCitas, setListaCitas }) {
  return (
    <Row>
      <Col>
        <h2>Panel de administrador</h2>
        <Cita
          listaCitas={listaCitas}
          setListaCitas={setListaCitas}
          usuario="admin"
        />
        <DashboardAdmin listaCitas={listaCitas} />
      </Col>
    </Row>
  );
}

export default VistaAdmin;

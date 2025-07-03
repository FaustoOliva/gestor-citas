import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

function DashboardAdmin({ listaCitas }) {
  const total = listaCitas.length;

  // Citas por fecha
  const citasPorFecha = listaCitas.reduce((acc, cita) => {
    acc[cita.fecha] = (acc[cita.fecha] || 0) + 1;
    return acc;
  }, {});

  // Mascotas más frecuentes
  const rankingMascotas = listaCitas.reduce((acc, cita) => {
    acc[cita.nombreM] = (acc[cita.nombreM] || 0) + 1;
    return acc;
  }, {});
  const topMascotas = Object.entries(rankingMascotas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // top 5

  return (
    <div>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Total de citas registradas</Card.Title>
          <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {total}
          </Card.Text>
        </Card.Body>
      </Card>

      <h5>Cantidad de citas por fecha</h5>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(citasPorFecha).map(([fecha, cantidad]) => (
            <tr key={fecha}>
              <td>{fecha}</td>
              <td>{cantidad}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5>Mascotas con más citas</h5>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {topMascotas.map(([nombre, cantidad]) => (
            <tr key={nombre}>
              <td>{nombre}</td>
              <td>{cantidad}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DashboardAdmin;

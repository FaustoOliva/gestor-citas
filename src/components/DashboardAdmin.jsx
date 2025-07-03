import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A445B2'];

function DashboardAdmin({ listaCitas }) {
  const total = listaCitas.length;

  // Agrupamos citas por fecha
  const citasPorFecha = listaCitas.reduce((acc, cita) => {
    acc[cita.fecha] = (acc[cita.fecha] || 0) + 1;
    return acc;
  }, {});
  const dataFechas = Object.entries(citasPorFecha).map(([fecha, cantidad]) => ({
    fecha,
    cantidad
  }));

  // Ranking de mascotas
  const rankingMascotas = listaCitas.reduce((acc, cita) => {
    acc[cita.nombreM] = (acc[cita.nombreM] || 0) + 1;
    return acc;
  }, {});
  const dataMascotas = Object.entries(rankingMascotas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));

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

      <h5>Citas por fecha</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataFechas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h5 className="mt-4">Mascotas con más citas</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataMascotas}
            dataKey="cantidad"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {dataMascotas.map((entry, index) => (
              <Cell key={entry.nombre} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardAdmin;

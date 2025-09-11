import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStats } from "../../services/front.js"; // Nuevo servicio para la API

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A445B2"];

function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        if (data instanceof Error) {
          throw data;
        }
        setStats(data);
        setError("");
      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!stats) {
    return null;
  }

  const dataAppointmentsByStatus = Object.entries(
    stats.totalAppointmentsByStatus
  ).map(([name, value]) => ({ name, value }));
  const dataAppointmentsByService = Object.entries(
    stats.totalAppointmentsByService
  ).map(([name, value]) => ({ name, value }));
  const dataAppointmentsBySpecies = Object.entries(
    stats.totalAppointmentsBySpecies
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="mt-5">
      <h3 className="mb-4">Estadísticas de la Aplicación</h3>
      <Row className="mb-4">
        <Col md={6} lg={4}>
          <Card className="text-center p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Total de Usuarios</Card.Title>
              <h1 className="display-4 fw-bold">{stats.totalUsers}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="text-center p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Mascotas Registradas</Card.Title>
              <h1 className="display-4 fw-bold">
                {Object.values(stats.totalPetsBySpecies).reduce(
                  (a, b) => a + b,
                  0
                )}
              </h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <Card.Title>Citas por Estado</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataAppointmentsByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {dataAppointmentsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <Card.Title>Citas por Especie</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataAppointmentsBySpecies}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#82ca9d"
                    label
                  >
                    {dataAppointmentsBySpecies.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <Card.Title>Citas por Servicio</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataAppointmentsByService}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#ffc658"
                    label
                  >
                    {dataAppointmentsByService.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardAdmin;

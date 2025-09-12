import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Alert, Container } from "react-bootstrap";
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

// Hook para detectar el ancho de la ventana
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

function DashboardAdmin() {
  const windowWidth = useWindowWidth();
  // Ajusta tamaño según ancho de pantalla
  const pieSize = windowWidth < 576 ? 50 : windowWidth < 768 ? 70 : 80;
  const pieHeight = windowWidth < 576 ? 170 : windowWidth < 768 ? 200 : 250;
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

  const dataAppointmentsByStatus = stats.totalAppointmentsByStatus.map(
    (item) => ({
      name: item.Status,
      value: item.Total,
    })
  );

  const dataAppointmentsByService = stats.totalAppointmentsByService.map(
    (item) => ({
      name: item.Service,
      value: item.Total,
    })
  );

  return (
    <Container fluid className="py-4 px-2">
      <Row className="justify-content-center mb-3">
        <Col xs={12} className="text-center">
          <h3 className="mb-4">DashBoard</h3>
        </Col>
      </Row>
      <Row className="g-3 mb-4 justify-content-center">
        <Col xs={6} sm={6} md={4} lg={3} className="d-flex">
          <Card className="text-center p-3 shadow-sm flex-fill w-100">
            <Card.Body>
              <Card.Title>Total de Usuarios</Card.Title>
              <h1 className="display-6 fw-bold">{stats.totalUsers}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} sm={6} md={4} lg={3} className="d-flex">
          <Card className="text-center p-3 shadow-sm flex-fill w-100">
            <Card.Body>
              <Card.Title>Especies Registradas</Card.Title>
              <Row className="fw-bold">
                {stats.totalPetsBySpecie.map((pet) => (
                  <Col xs={12} sm={12} md={4} lg={6} key={pet.Specie} className="mb-1">
                    {pet.Specie}: {pet.Total}
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 justify-content-center">
        <Col xs={12} sm={12} md={4} lg={3} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Citas por Estado</Card.Title>
              <ResponsiveContainer width="100%" height={pieHeight}>
                <PieChart>
                  <Pie
                    data={dataAppointmentsByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={pieSize}
                    fill="#8884d8"
                    label={windowWidth >= 576}
                  >
                    {dataAppointmentsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-status-${index}`}
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
        <Col xs={12} sm={12} md={4} lg={3} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Citas por Servicio</Card.Title>
              <ResponsiveContainer width="100%" height={pieHeight}>
                <PieChart>
                  <Pie
                    data={dataAppointmentsByService}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={pieSize}
                    fill="#ffc658"
                    label={windowWidth >= 576}
                  >
                    {dataAppointmentsByService.map((entry, index) => (
                      <Cell
                        key={`cell-service-${index}`}
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
    </Container>
  );
}

export default DashboardAdmin;

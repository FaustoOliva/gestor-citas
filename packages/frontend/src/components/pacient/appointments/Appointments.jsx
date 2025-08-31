import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  Container,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
} from "react-bootstrap";
import {
  getAppointmentsByUserId,
  deleteAppointment,
  updateAppointment,
} from "../../../services/appointment";

const AppointmentsList = ({ userId, refreshTrigger }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointmentsByUserId(userId);
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Hubo un problema al cargar tus citas.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId, refreshTrigger]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pendiente":
        return "warning";
      case "Confirmada":
        return "primary";
      case "Completada":
        return "success";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Cargando tus citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (appointments.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        Aún no tienes citas agendadas. ¡Agendá una ahora!
      </Alert>
    );
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId)
      );
    } catch (err) {
      console.error("Error canceling appointment:", err);
      setError("Hubo un problema al cancelar la cita.");
    }
  };

  const handleEditAppointment = (appointmentId) => {
    // Logic to handle editing the appointment
  };

  return (
    <Container className="py-4">
      <h3 className="text-center mb-4">Mis Citas</h3>
      <div className="row g-4 justify-content-center">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="col-12 col-md-6 col-lg-3 d-flex justify-content-center"
          >
            <Card
              className="shadow-sm h-100"
              style={{ maxWidth: "360px", width: "100%", minWidth: "230px" }}
            >
              <Card.Body>
                <Card.Title
                  className="mb-2 fw-bold text-center"
                  style={{ fontSize: "1.35rem" }}
                >
                  {appointment.serviceName} para {appointment.petName}
                </Card.Title>
                <Card.Subtitle
                  className="mb-3 text-primary text-center"
                  style={{ fontSize: "1rem" }}
                >
                  {appointment.description}
                </Card.Subtitle>
                <Card.Text className="mb-2 text-muted ">
                  <i className="bi bi-calendar-event me-2"></i>
                  <strong>📅</strong> {formatDate(appointment.date)}
                </Card.Text>
                <Card.Text className="mb-2 text-muted">
                  <i className="bi bi-clock me-2"></i>
                  <strong>⏱️</strong> {appointment.durationMinutes} minutos
                </Card.Text>
                <Card.Text className="text-muted">
                  <i className="bi bi-currency-dollar me-2"></i>
                  <strong>$</strong> {appointment.price}
                </Card.Text>
                <Badge
                  bg={getStatusVariant(appointment.status)}
                  className="mb-0 px-2 py-2"
                  style={{ fontSize: "0.95rem" }}
                >
                  {appointment.status.toUpperCase()}
                </Badge>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center bg-white border-top-0 pt-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="px-2 py-2"
                  style={{ fontSize: "0.95rem" }}
                  onClick={() => handleEditAppointment(appointment.id)}
                >
                  Modificar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="px-2 py-2"
                  style={{ fontSize: "0.95rem" }}
                  onClick={() => handleCancelAppointment(appointment.id)}
                >
                  Cancelar
                </Button>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
};

AppointmentsList.propTypes = {
  userId: PropTypes.number.isRequired,
  refreshTrigger: PropTypes.number.isRequired,
};

export default AppointmentsList;

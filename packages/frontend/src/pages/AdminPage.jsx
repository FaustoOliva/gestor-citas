import React, { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Card,
  Form,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Modal,
} from "react-bootstrap";
import { getAppointments } from "../services/appointment";

export const filterAppointments = (appointments, filters) => {
  // Lógica de filtrado
  if (filters.date) {
    appointments = appointments.filter((app) => app?.date.slice(0, 10) == filters.date);
  }
  if (filters.status) {
    appointments = appointments.filter((app) => app?.status == filters.status);
  }
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    appointments = appointments.filter(
      (app) =>
        app?.pet.specieName.toLowerCase().includes(searchTerm) ||
        app?.user.name.toLowerCase().includes(searchTerm) ||
        app?.service.name.toLowerCase().includes(searchTerm)
    );
  }

  return appointments;
};

const AdminPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ date: "", status: "", search: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      var data = await getAppointments();
      data = filterAppointments(data, filters);
      setAppointments(data);
    } catch (err) {
      setError("Error al cargar las citas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setLoading(true);
    try {
      //await updateAppointmentStatus(id, newStatus);
      fetchAppointments(); // Recargar la lista para reflejar el cambio
    } catch (err) {
      setError("Error al actualizar el estado de la cita.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const confirmDelete = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!appointmentToDelete) return;
    setLoading(true);
    setShowDeleteModal(false);
    try {
      //await deleteAppointment(appointmentToDelete.id);
      setAppointmentToDelete(null);
      fetchAppointments(); // Recargar la lista
    } catch (err) {
      setError("Error al eliminar la cita.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pendiente":
        return "warning";
      case "Confirmada":
        return "primary";
      case "Completada":
        return "success";
      case "Cancelada":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Container fluid className="py-4">
      <h3 className="mb-4">Panel de Administración de Citas</h3>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Filtros</Card.Title>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Completada">Completada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Buscar</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    placeholder="Nombre mascota o dueño..."
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Especie</th>
            <th>Dueño</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.pet.specieName}</td>
                <td>{app.user.name}</td>
                <td>{app.service.name}</td>
                <td>
                  {formatDate(app.date)}
                </td>
                <td>
                  <Badge bg={getStatusVariant(app.status)}>
                    {app.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleStatusUpdate(app.id, "Confirmada")}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleStatusUpdate(app.id, "Confirmada")}
                    >
                      Confirmar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(app)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No se encontraron citas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas cancelar la cita de **
          {appointmentToDelete?.NombreEspecie}** (
          {appointmentToDelete?.serviceName})?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No, mantener
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sí, cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPage;

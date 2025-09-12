import React, { useState } from "react";
import { Container, Spinner, Alert, Button, Card } from "react-bootstrap";
import { getAppointments } from "../services/appointment.js";
import DashboardAdmin from "../components/admin/DashboardAdmin.jsx";
import DeleteAppointmentModal from "../components/admin/DeleteApppointmentModal.jsx";
import DetailsAppModal from "../components/admin/DetailsAppModal.jsx";
import AppsTable from "../components/admin/AppsTable.jsx";
import { Filters, filterAppointments } from "../components/admin/Filters.jsx";

const AdminPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ date: "", status: "", search: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [appointmentDetailsId, setAppointmentDetailsId] = useState(null);

  const fetchAppointments = async () => {
    setShowTable(true);
    setLoading(true);
    const minLoadingTime = 600; // ms
    const startTime = Date.now();
    try {
      const data = await getAppointments();
      const filteredData = filterAppointments(data, filters);
      setAppointments(filteredData);
    } catch (err) {
      setError("Error al cargar las citas.");
      console.error(err);
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingTime) {
        setTimeout(() => setLoading(false), minLoadingTime - elapsed);
      } else {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const confirmDelete = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (appointment) => {
    console.log("Viewing details for appointment:", appointment.id);
    setAppointmentDetailsId(appointment.id);
    setShowDetailsModal(true);
  };

  return (
    <Container fluid className="py-4">
      <h3 className="mb-4">Panel de Administración de Citas</h3>

      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={fetchAppointments}
      />

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {showTable && !loading && (
        <Card className="mt-4 shadow-sm">
          <Card.Body>
            <Card.Title>Resultados de la Búsqueda</Card.Title>
            <AppsTable
              appointments={appointments}
              confirmDelete={confirmDelete}
              handleViewDetails={handleViewDetails}
            />
          </Card.Body>
        </Card>
      )}

      <DeleteAppointmentModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        appointmentToDelete={appointmentToDelete}
      />

      <DetailsAppModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        appointmentDetailsId={appointmentDetailsId}
      />

      <hr />
      <DashboardAdmin />
    </Container>
  );
};

export default AdminPage;

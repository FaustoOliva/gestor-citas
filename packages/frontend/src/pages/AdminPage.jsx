import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { getAppointments } from "../services/appointment.js";
import DashboardAdmin from "../components/admin/DashboardAdmin.jsx";
import DeleteAppointmentModal from "../components/admin/DeleteApppointmentModal.jsx";
import AppsTable from "../components/admin/AppsTable.jsx";
import {Filters, filterAppointments} from "../components/admin/Filters.jsx";

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

  return (
    <Container fluid className="py-4">
      <h3 className="mb-4">Panel de Administración de Citas</h3>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Filters filters={filters} onFilterChange={handleFilterChange} />

      <AppsTable
        appointments={appointments}
        handleStatusUpdate={handleStatusUpdate}
        confirmDelete={confirmDelete}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteAppointmentModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        appointmentToDelete={appointmentToDelete}
        handleDelete={handleDelete}
      />

      <DashboardAdmin listaCitas={appointments} />
    </Container>
  );
};

export default AdminPage;

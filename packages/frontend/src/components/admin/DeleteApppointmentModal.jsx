import React from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { deleteAppointment } from "../../services/appointment.js";

const DeleteAppointmentModal = ({
  showDeleteModal,
  setShowDeleteModal,
  appointmentToDelete,
}) => {

   const handleDelete = async () => {
    if (!appointmentToDelete) return;
    setLoading(true);
    setShowDeleteModal(false);
    try {
      await deleteAppointment(appointmentToDelete.id);
    } catch (err) {
      setError("Error al eliminar la cita.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Cancelación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas cancelar la cita de {appointmentToDelete?.user?.name} ({appointmentToDelete?.service.name})?
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
  );
};

DeleteAppointmentModal.propTypes = {
  showDeleteModal: PropTypes.bool.isRequired,
  setShowDeleteModal: PropTypes.func.isRequired,
  appointmentToDelete: PropTypes.object,
};

export default DeleteAppointmentModal;

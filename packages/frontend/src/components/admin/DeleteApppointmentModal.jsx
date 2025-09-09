import React from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const DeleteAppointmentModal = ({
  showDeleteModal,
  setShowDeleteModal,
  appointmentToDelete,
  handleDelete,
}) => {
  return (
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
  );
};

DeleteAppointmentModal.propTypes = {
  showDeleteModal: PropTypes.bool.isRequired,
  setShowDeleteModal: PropTypes.func.isRequired,
  appointmentToDelete: PropTypes.object,
  handleDelete: PropTypes.func.isRequired,
};

export default DeleteAppointmentModal;

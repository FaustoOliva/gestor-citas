import React from "react";
import { Modal, ListGroup, Spinner, Alert } from "react-bootstrap";
import PropTypes from "prop-types";

const HistoryPetModal = ({ show, handleClose, petHistory, loading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Historial de Citas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : petHistory.length > 0 ? (
          <ListGroup>
            {petHistory.map((appointment) => (
              <ListGroup.Item key={appointment.id}>
                <strong>{appointment.serviceName}</strong> el{" "}
                {formatDate(appointment.date)}
                <br />
                <small>Estado: {appointment.status}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Alert variant="info">Esta mascota no tiene citas agendadas.</Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

HistoryPetModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  petHistory: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default HistoryPetModal;

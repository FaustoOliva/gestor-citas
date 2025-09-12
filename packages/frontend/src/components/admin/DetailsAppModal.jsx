import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { getAppointmentById } from "../../services/appointment.js";

const DetailsAppModal = ({
  showDetailsModal,
  setShowDetailsModal,
  appointmentDetailsId,
}) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (appointmentDetailsId) {
        const data = await getAppointmentById(appointmentDetailsId);
        setDetails(data);
      }
    };

    fetchDetails();
  }, [appointmentDetailsId]);

  return (
    <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Usuario:</strong> {details?.user?.name}
        </p>
        <p>
          <strong>Servicio:</strong> {details?.service?.name}
        </p>
        <p>
          <strong>Fecha:</strong> {details?.date}
        </p>
        <p>
          <strong>Estado:</strong> {details?.status}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => {}}>
          Modificar
        </Button>
        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DetailsAppModal.propTypes = {
  showDetailsModal: PropTypes.bool.isRequired,
  setShowDetailsModal: PropTypes.func.isRequired,
  appointmentDetailsId: PropTypes.number.isRequired,
};

export default DetailsAppModal;

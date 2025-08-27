import React from 'react';
import { Modal, ListGroup, Spinner, Alert } from 'react-bootstrap';

const HistoryPetModal = ({ show, handleClose, petHistory, loading }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Citas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center"><Spinner animation="border" /></div>
                ) : petHistory.length > 0 ? (
                    <ListGroup>
                        {petHistory.map(appointment => (
                            <ListGroup.Item key={appointment.id}>
                                **{appointment.service}** el **{appointment.date}**
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

export default HistoryPetModal;
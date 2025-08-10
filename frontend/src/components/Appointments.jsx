import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, ListGroup, Badge, Button } from 'react-bootstrap';
import { getAppointmentsByUser } from '../services/appointment';

const AppointmentsList = ({ userId, refreshTrigger }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointmentsByUser(userId);
                setAppointments(data);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Hubo un problema al cargar tus citas.');
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
            case 'Pendiente': return 'warning';
            case 'Confirmada': return 'primary';
            case 'Completada': return 'success';
            default: return 'secondary';
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
        return <Alert variant="danger" className="text-center">{error}</Alert>;
    }

    if (appointments.length === 0) {
        return (
            <Alert variant="info" className="text-center">
                Aún no tienes citas agendadas. ¡Agendá una ahora!
            </Alert>
        );
    }

    return (
        <Container className="py-4">
            <h3 className="text-center mb-4">Mis Citas</h3>
            <ListGroup>
                {appointments.map(appointment => (
                    <ListGroup.Item key={appointment.IdCita} className="mb-3 p-3 shadow-sm rounded">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="mb-1">{appointment.NombreServicio} para {appointment.NombreEspecie}</h3>
                                <h5 className="text-primary mb-2">{appointment.Descripcion}</h5>
                                <p className="text-muted mb-1">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    {`Fecha: ${appointment.Fecha}, Hora: ${appointment.Hora}`}
                                </p>
                                <p className="text-muted mb-0">
                                    <i className="bi bi-clock me-2"></i>
                                    {`Duración: ${appointment.Duracion} minutos`}
                                </p>
                                <p className="text-muted mb-0">
                                    <i className="bi bi-currency-dollar me-2"></i>
                                    {`Precio: ${appointment.Precio}`}
                                </p>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                                <Badge bg={getStatusVariant('Pendiente')} className="mb-2">
                                    {'Pendiente'.toUpperCase()}
                                </Badge>
                                <Button variant="outline-danger" size="sm">Cancelar</Button>
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default AppointmentsList;
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CreateAppointmentForm from '../components/AppointmentForm';
import Appointments from '../components/Appointments';

const PacientPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const handleAppointmentCreated = () => {
        setRefreshCounter(prev => prev + 1);
    };

    useEffect(() => {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }
    }, []);

    return (
        <Container className="text-center mt-5">
            <h1>Bienvenido, {currentUser ? currentUser.nombre : ''}</h1>
            <CreateAppointmentForm onAppointmentCreated={handleAppointmentCreated} />
            <Appointments userId={currentUser ? currentUser.Id : null} refreshTrigger={refreshCounter} />
        </Container>
    );
};

export default PacientPage;
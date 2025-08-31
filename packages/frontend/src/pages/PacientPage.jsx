import React, { useState, useEffect } from "react";
import { Container, Button, ButtonGroup } from "react-bootstrap";
import CreateAppointmentForm from "../components/pacient/appointments/AppointmentForm";
import Appointments from "../components/pacient/appointments/Appointments";
import CreatePetForm from "../components/pacient/pets/PetForm";
import Pets from "../components/pacient/pets/Pets";

const PacientPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshAppointments, setRefreshAppointments] = useState(0);
  const [refreshPets, setRefreshPets] = useState(0);
  const [activeView, setActiveView] = useState("appointments");

  const handleAppointmentCreated = () => {
    setRefreshAppointments((prev) => prev + 1);
  };

  const handlePetCreated = () => {
    setRefreshPets((prev) => prev + 1);
  };

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Container className="text-center mt-5">
      <h1>Bienvenido, {currentUser ? currentUser.name : ""}</h1>
      <div className="d-flex justify-content-center mb-4">
        <ButtonGroup>
          <Button
            variant={
              activeView === "appointments" ? "primary" : "outline-primary"
            }
            onClick={() => setActiveView("appointments")}
          >
            Mis Citas
          </Button>
          <Button
            variant={activeView === "pets" ? "primary" : "outline-primary"}
            onClick={() => setActiveView("pets")}
          >
            Mis Mascotas
          </Button>
        </ButtonGroup>
      </div>
      {activeView === "appointments" && (
        <>
          <CreateAppointmentForm
            userId={currentUser ? currentUser.id : null}
            onAppointmentCreated={handleAppointmentCreated}
          />
          <Appointments
            userId={currentUser ? currentUser.id : null}
            refreshTrigger={refreshAppointments}
          />
        </>
      )}

      {activeView === "pets" && (
        <>
          <CreatePetForm
            userId={currentUser ? currentUser.id : null}
            onPetCreated={handlePetCreated}
          />
          <Pets
            userId={currentUser ? currentUser.id : null}
            refreshTrigger={refreshPets}
          />
        </>
      )}
    </Container>
  );
};

export default PacientPage;

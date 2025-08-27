import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { getPetsByUser, deletePet, updatePet } from "../../services/pet.js";
import { getAppointmentsByPetId } from "../../services/appointment.js";
import PropTypes from "prop-types";
import EditPetModal from "./EditPetModal.jsx";
import HistoryPetModal from "./HistoryPetModal.jsx";

const Pets = ({ userId, refreshTrigger }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [petToEdit, setPetToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [petHistory, setPetHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError("") , 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const data = await getPetsByUser(userId);
        setPets(data);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Hubo un problema al cargar tus mascotas.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPets();
    }
  }, [userId, refreshTrigger]);

  const handleDeletePet = async (petId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      setLoading(true);
      try {
        await deletePet(petId);
        setPets((prevPets) => prevPets.filter((pet) => pet.Pet_Id !== petId));
      } catch (error) {
        console.error("Error deleting pet:", error);
        setError("Hubo un problema al eliminar la mascota.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewHistory = async (petId) => {
    setHistoryLoading(true);
    try {
      const history = await getAppointmentsByPetId(petId);
      setPetHistory(history);
      setShowHistoryModal(true);
    } catch (err) {
      setError("No se pudo cargar el historial de citas.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleEditPet = async (petId) => {
    const pet = pets.find((p) => p.Pet_Id === petId);
    setPetToEdit(pet);
    setShowEditModal(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!petToEdit) return;
    console.log(petToEdit);
    setLoading(true);
    setShowEditModal(false);
    try {
      await updatePet(petToEdit.Pet_Id, petToEdit);
      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet.Pet_Id === petToEdit.Pet_Id ? petToEdit : pet
        )
      );
    } catch (err) {
      setError("Hubo un problema al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando tus mascotas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (pets.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        Aún no tienes mascotas registradas. ¡Agrega una ahora!
      </Alert>
    );
  }

  // Helper function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Container className="py-4">
      <h3 className="text-center mb-4">Mis Mascotas</h3>
      <div className="row g-4 justify-content-center">
        {pets.map((pet) => (
          <div
            key={pet.Pet_Id || Math.random()}
            className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch"
          >
            <Card className="shadow-sm w-100 h-100">
              <Card.Body>
                <Card.Title className="mb-2">
                  {pet.Pet_Name ? pet.Pet_Name : "Sin nombre"}{" "}
                  <span className="text-secondary">
                    ({pet.Specie_Name ? pet.Specie_Name : "Sin especie"})
                  </span>
                </Card.Title>
                <Card.Text>
                  <p className="mb-1">
                    <span className="me-2">🐾</span>
                    <strong>
                    {pet.Pet_Breed ? pet.Pet_Breed : "Desconocida"}
                    </strong>
                  </p>
                  <p className="mb-1">
                    <span className="me-2">🎂</span>
                    <strong>
                    {pet.Pet_BirthDate ? formatDate(pet.Pet_BirthDate) : "Sin fecha"}
                    </strong>
                  </p>
                  <p className="mb-0">
                    <span className="me-2">⚖️</span>
                    <strong>
                    {pet.Pet_Weight ? pet.Pet_Weight : "Sin peso"} Kg
                    </strong>
                    {" "}
                    <strong>
                    ({pet.Pet_Size ? pet.Pet_Size : "Sin tamaño"})
                    </strong>
                  </p>
                </Card.Text>
                <div className="d-flex gap-2 flex-wrap mt-2 justify-content-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeletePet(pet.Pet_Id)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleViewHistory(pet.Pet_Id)}
                  >
                    Ver Historial
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleEditPet(pet.Pet_Id)}
                  >
                    Editar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <EditPetModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        petToEdit={petToEdit}
        setPetToEdit={setPetToEdit}
        handleSave={handleEditSave}
      />

      <HistoryPetModal
        show={showHistoryModal}
        handleClose={() => setShowHistoryModal(false)}
        petHistory={petHistory}
        loading={historyLoading}
      />
    </Container>
  );
};

Pets.propTypes = {
  userId: PropTypes.number.isRequired,
  refreshTrigger: PropTypes.number.isRequired,
};

export default Pets;

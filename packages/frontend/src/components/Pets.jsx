import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Spinner,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import { getPetsByUser } from "../services/pet.js";

const Pets = ({ userId, refreshTrigger }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            key={pet.Pet_ID || Math.random()}
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
                  <strong>Raza:</strong>{" "}
                  {pet.Pet_Breed ? pet.Pet_Breed : "Desconocida"}
                  <br />
                  <strong>Nacimiento:</strong>{" "}
                  {pet.Pet_BirthDate
                    ? formatDate(pet.Pet_BirthDate)
                    : "Sin fecha"}
                  <br />
                  <strong>Peso:</strong>{" "}
                  {pet.Pet_Weight ? pet.Pet_Weight : "Sin peso"} Kg
                </Card.Text>
                <div className="d-flex gap-2 flex-wrap mt-2 justify-content-center">
                  <Button variant="outline-danger" size="sm">
                    Eliminar
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    Ver Historial
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    Editar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Pets;

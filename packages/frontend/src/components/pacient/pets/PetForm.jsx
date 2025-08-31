import React, { useState, useEffect } from "react";
import { Form, Button, Card, Spinner, Alert, Container } from "react-bootstrap";
import { createPet } from "../../../services/pet.js";
import { getSpecies } from "../../../services/front.js";
import PropTypes from "prop-types";

const CreatePetForm = ({ userId, onPetCreated }) => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState(0);
  const [size, setSize] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const data = await getSpecies();
        setSpeciesList(data);
      } catch (err) {
        console.error("Error fetching species:", err);
      }
    };

    fetchSpecies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validación extra
    if (
      !name.trim() ||
      !species ||
      !breed.trim() ||
      !birthDate ||
      !weight ||
      !size
    ) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    const petData = {
      name: name.trim(),
      species,
      breed: breed.trim(),
      birthDate,
      weight: Number(weight),
      size,
      userId,
    };

    try {
      await createPet(petData);
      setSuccess("¡Mascota agregada con éxito!");
      onPetCreated && onPetCreated();
      setName("");
      setSpecies("");
      setBreed("");
      setBirthDate("");
      setWeight("");
      setSize("");
    } catch (err) {
      setError("Hubo un problema al agregar la mascota.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4 col-md-6 col-lg-6">
      <Card className="p-4 shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="text-center mb-4">Agregar Mascota</Card.Title>
          <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
            {loading && (
              <div className="text-center mb-3">
                <Spinner animation="border" />
              </div>
            )}
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="mb-3">
                {success}
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="petSpecies">
              <Form.Label>Especie</Form.Label>
              <Form.Select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                required
              >
                <option value="">Selecciona una especie</option>
                {speciesList.map((specie) => (
                  <option key={specie.id} value={specie.id}>
                    {specie.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="petBreed">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Ej: Labrador"
                minLength={2}
                maxLength={30}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="petName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Firulais"
                minLength={2}
                maxLength={30}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="petWeight">
              <Form.Label>Peso (Kg)</Form.Label>
              <Form.Control
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min={0.1}
                step={0.1}
                placeholder="Ej: 12.5"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="petSize">
              <Form.Label>Tamaño</Form.Label>
              <Form.Select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
              >
                <option value="">Selecciona un tamaño</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="petBirthDate">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Mascota"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

CreatePetForm.propTypes = {
  userId: PropTypes.number.isRequired,
  onPetCreated: PropTypes.func.isRequired,
};

export default CreatePetForm;

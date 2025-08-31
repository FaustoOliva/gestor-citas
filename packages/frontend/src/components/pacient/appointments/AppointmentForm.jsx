import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Alert,
} from "react-bootstrap";
import { createAppointment } from "../../../services/appointment.js";
import { getServicesBySpecie } from "../../../services/front.js";
import { getPetsByUser } from "../../../services/pet.js";

const groupFields = (fieldsArray) => {
  const grouped = {};
  fieldsArray.forEach((field) => {
    if (field.type === "select") {
      // Si es un select, creamos o actualizamos un objeto con sus opciones
      if (!grouped[field.id]) {
        grouped[field.id] = {
          ...field,
          options: field.options ?? [],
        };
      }
    } else {
      // Para otros tipos de campos, simplemente los agregamos
      grouped[field.id] = field;
    }
  });

  return Object.values(grouped);
};

const CreateAppointmentForm = ({ userId, onAppointmentCreated }) => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);
  const [formValues, setFormValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentServiceDetails = services.find(
    (s) => s.id === parseInt(selectedService),
  );

  // Obtener mascotas
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const data = await getPetsByUser(userId);

        setPets(data);
        setError("");
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
        setError(
          "No se pudieron cargar las mascotas. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // Manejar cambio de mascota
  const handlePetChange = async (e) => {
    const petId = e.target.value;
    const pet = pets.find((p) => p.id == petId);

    setSelectedPet(petId);
    setSelectedService("");
    setServices([]);
    setDynamicFields([]);
    setFormValues([]);
    setSuccess("");

    if (petId) {
      setLoading(true);
      try {
        const res = await getServicesBySpecie(pet.specieId);
        if (res instanceof Error) {
          throw res;
        }
        setServices(res);
        setError("");
      } catch (err) {
        console.error("Error al obtener servicios:", err);
        setError(
          "No se pudieron cargar los servicios. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Manejar cambio de servicio
  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);
    setDynamicFields([]);
    setFormValues([]);
    setSuccess("");

    if (serviceId) {
      const service = services.find(
        (s) => s.id === parseInt(serviceId),
      );
      if (service) {
        const groupedFields = groupFields(service.fields);
        setDynamicFields(groupedFields);
        const initialValues = groupedFields.reduce(
          (acc, field) => ({
            ...acc,
            [field.name]: field.type === "boolean" ? false : "",
          }),
          {},
        );
        setFormValues(initialValues);
      }
    }
  };

  // Manejar cambios en campos dinámicos
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validar formulario
  const validateForm = () => {
    let valid = true;
    const errors = {};
    dynamicFields.forEach((field) => {
      if (field.isRequired && !formValues[field.name]) {
        valid = false;
        errors[field.name] = `${field.name} es requerido.`;
      }
    });

    return valid;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }
    setError("");
    setLoading(true);
    
    const appointmentData = {
      userId: userId,
      petId: parseInt(selectedPet),
      serviceId: parseInt(selectedService),
      date: new Date(),
      details: dynamicFields.map((field) => ({
        fieldId: field.id,
        fieldValue: formValues[field.name],
      })),
    };

    try {
      await createAppointment(appointmentData);
      
      setSuccess("¡Cita agendada con éxito!");

      if (onAppointmentCreated) {
        onAppointmentCreated();
      }

      setSelectedService("");
      setServices([]);
      setDynamicFields([]);
      setFormValues([]);
    } catch (error) {
      console.error("Error al crear la cita:", error);
      setError("No se pudo crear la cita. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const renderDynamicForm = () =>
    dynamicFields.length > 0 && (
      <>
        <h5 className="mt-4 mb-3">Detalles del Servicio</h5>
        {dynamicFields.map((field) => (
          <Form.Group
            as={Row}
            className="mb-3"
            controlId={`form-${field.name}`}
            key={field.id}
          >
            {console.log(field)}
            <Form.Label column sm={4} className="text-sm-end">
              {field.name}{" "}
              {field.isRequired && <span className="text-danger">*</span>}
            </Form.Label>
            <Col sm={8}>
              {field.type === "select" ? (
                <Form.Select
                  name={field.name}
                  value={formValues[field.name] || ""}
                  onChange={handleFieldChange}
                  required={field.isRequired}
                >
                  <option value="">Seleccione una opción...</option>
                  {field.options.map((option) => (
                    <option key={option?.id} value={option?.id}>
                      {option?.value}
                    </option>
                  ))}
                </Form.Select>
              ) : field.type === "boolean" ? (
                <div className="d-flex gap-3 align-items-center pt-2">
                  <Form.Check
                    type="radio"
                    label="Sí"
                    name={field.name}
                    checked={formValues[field.name] === true}
                    onChange={() =>
                      handleFieldChange({
                        target: {
                          name: field.name,
                          value: true,
                          type: "radio",
                        },
                      })
                    }
                    required={field.isRequired}
                    id={`radio-yes-${field.id}`}
                  />
                  <Form.Check
                    type="radio"
                    label="No"
                    name={field.name}
                    checked={formValues[field.name] === false}
                    onChange={() =>
                      handleFieldChange({
                        target: {
                          name: field.name,
                          value: false,
                          type: "radio",
                        },
                      })
                    }
                    required={field.isRequired}
                    id={`radio-no-${field.id}`}
                  />
                </div>
              ) : (
                <Form.Control
                  type={field.type}
                  name={field.name}
                  value={formValues[field.name] || ""}
                  onChange={handleFieldChange}
                  required={field.isRequired}
                  placeholder={`Ingrese ${field.name.toLowerCase()}`}
                />
              )}
            </Col>
          </Form.Group>
        ))}
      </>
    );

  return (
    <Container className="py-4 col-md-6 col-lg-6">
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4 fs-4">
                Crear Cita
              </Card.Title>
              {loading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status" />
                  <p className="mt-2">Cargando...</p>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <Form.Group className="mb-3" controlId="petSelect">
                    <Form.Label>Mascota</Form.Label>
                    <Form.Select
                      value={selectedPet}
                      onChange={handlePetChange}
                      required
                    >
                      <option value="">Seleccione una mascota</option>
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {selectedPet && (
                    <Form.Group className="mb-3" controlId="serviceSelect">
                      <Form.Label>Servicio</Form.Label>
                      <Form.Select
                        value={selectedService}
                        onChange={handleServiceChange}
                        required
                      >
                        <option value="">Seleccione un servicio</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}

                  {currentServiceDetails && (
                    <Card className="mb-4">
                      <Card.Body>
                        <Card.Title>{currentServiceDetails.name}</Card.Title>
                        <Card.Text>
                          <p className="mb-1">
                            {currentServiceDetails.description}
                          </p>
                          <p className="mb-1">
                            Duración: {currentServiceDetails.durationMinutes}{" "}
                            minutos
                          </p>
                          <p className="mb-0">
                            Precio: ${currentServiceDetails.price}
                          </p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  )}

                  {renderDynamicForm()}

                  {selectedService && (
                    <div className="d-grid gap-2 mt-4">
                      <Button variant="primary" type="submit" size="lg">
                        Confirmar Cita
                      </Button>
                    </div>
                  )}
                </Form>
              )}
            </Card.Body>
          </Card>
    </Container>
  );
};

CreateAppointmentForm.propTypes = {
  userId: PropTypes.number,
  onAppointmentCreated: PropTypes.func.isRequired,
};

export default CreateAppointmentForm;

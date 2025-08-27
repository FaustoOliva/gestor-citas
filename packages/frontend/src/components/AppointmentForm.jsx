import React, { useState, useEffect } from "react";
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
import { createAppointment } from "../services/appointment.js";
import { getSpecies, getServicesBySpecie } from "../services/front.js";

const groupFields = (fieldsArray) => {
  const grouped = {};
  fieldsArray.forEach((field) => {
    if (field.TipoCampo === "select") {
      // Si es un select, creamos o actualizamos un objeto con sus opciones
      if (!grouped[field.IdCampo]) {
        grouped[field.IdCampo] = {
          ...field,
          options: [],
        };
      }
      grouped[field.IdCampo].options.push(field.ValorOpcion);
    } else {
      // Para otros tipos de campos, simplemente los agregamos
      grouped[field.IdCampo] = field;
    }
  });

  return Object.values(grouped);
};

const CreateAppointmentForm = ({ onAppointmentCreated }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [species, setSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentServiceDetails = services.find(
    (s) => s.IdServicio === parseInt(selectedService),
  );

  // Obtener especies
  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      try {
        const data = await getSpecies();
        if (data instanceof Error) {
          throw data;
        }
        setSpecies(data);
        setError("");
      } catch (error) {
        console.error("Error al obtener especies:", error);
        setError(
          "No se pudieron cargar las especies. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSpecies();
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
  }, []);

  // Manejar cambio de especie
  const handleSpeciesChange = async (e) => {
    const speciesId = e.target.value;
    setSelectedSpecies(speciesId);

    setSelectedService("");
    setServices([]);
    setDynamicFields([]);
    setFormValues({});
    setSuccess("");

    if (speciesId) {
      setLoading(true);
      try {
        const res = await getServicesBySpecie(speciesId);
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
    setFormValues({});
    setSuccess("");

    if (serviceId) {
      const service = services.find(
        (s) => s.IdServicio === parseInt(serviceId),
      );
      if (service) {
        const groupedFields = groupFields(service.Campos);
        setDynamicFields(groupedFields);
        const initialValues = groupedFields.reduce(
          (acc, field) => ({
            ...acc,
            [field.NombreCampo]: field.TipoCampo === "boolean" ? false : "",
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
      if (field.EsRequerido && !formValues[field.NombreCampo]) {
        valid = false;
        errors[field.NombreCampo] = `${field.NombreCampo} es requerido.`;
      }
    });
    // Aquí podrías manejar los errores, por ejemplo, guardándolos en un estado.
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
      userId: currentUser.Id,
      speciesId: selectedSpecies,
      serviceId: selectedService,
      fields: formValues,
    };
    console.log("Cita enviada:", appointmentData);

    try {
      const res = await createAppointment(appointmentData);
      if (res instanceof Error) {
        throw res;
      }
      console.log("Cita creada exitosamente");
      setSuccess("¡Cita agendada con éxito!");

      if (onAppointmentCreated) {
        onAppointmentCreated();
      }

      setSelectedSpecies("");
      setSelectedService("");
      setServices([]);
      setDynamicFields([]);
      setFormValues({});
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
            controlId={`form-${field.NombreCampo}`}
            key={field.IdCampo}
          >
            <Form.Label column sm={4} className="text-sm-end">
              {field.NombreCampo}{" "}
              {field.EsRequerido && <span className="text-danger">*</span>}
            </Form.Label>
            <Col sm={8}>
              {field.TipoCampo === "select" ? (
                <Form.Select
                  name={field.NombreCampo}
                  value={formValues[field.NombreCampo] || ""}
                  onChange={handleFieldChange}
                  required={field.EsRequerido}
                >
                  <option value="">Seleccione una opción...</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              ) : field.TipoCampo === "boolean" ? (
                <div className="d-flex gap-3 align-items-center pt-2">
                  <Form.Check
                    type="radio"
                    label="Sí"
                    name={field.NombreCampo}
                    checked={formValues[field.NombreCampo] === true}
                    onChange={() =>
                      handleFieldChange({
                        target: {
                          name: field.NombreCampo,
                          value: true,
                          type: "radio",
                        },
                      })
                    }
                    required={field.EsRequerido}
                    id={`radio-yes-${field.IdCampo}`}
                  />
                  <Form.Check
                    type="radio"
                    label="No"
                    name={field.NombreCampo}
                    checked={formValues[field.NombreCampo] === false}
                    onChange={() =>
                      handleFieldChange({
                        target: {
                          name: field.NombreCampo,
                          value: false,
                          type: "radio",
                        },
                      })
                    }
                    required={field.EsRequerido}
                    id={`radio-no-${field.IdCampo}`}
                  />
                </div>
              ) : (
                <Form.Control
                  type={field.TipoCampo}
                  name={field.NombreCampo}
                  value={formValues[field.NombreCampo] || ""}
                  onChange={handleFieldChange}
                  required={field.EsRequerido}
                  placeholder={`Ingrese ${field.NombreCampo.toLowerCase()}`}
                />
              )}
            </Col>
          </Form.Group>
        ))}
      </>
    );

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
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

                  <Form.Group className="mb-3" controlId="speciesSelect">
                    <Form.Label>Especie</Form.Label>
                    <Form.Select
                      value={selectedSpecies}
                      onChange={handleSpeciesChange}
                      required
                    >
                      <option value="">Seleccione una especie</option>
                      {species.map((sp) => (
                        <option key={sp.Specie_Id} value={sp.Specie_Id}>
                          {sp.Specie_Name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {selectedSpecies && (
                    <Form.Group className="mb-3" controlId="serviceSelect">
                      <Form.Label>Servicio</Form.Label>
                      <Form.Select
                        value={selectedService}
                        onChange={handleServiceChange}
                        required
                      >
                        <option value="">Seleccione un servicio</option>
                        {services.map((s) => (
                          <option key={s.IdServicio} value={s.IdServicio}>
                            {s.Nombre}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}

                  {currentServiceDetails && (
                    <Card className="mb-4">
                      <Card.Body>
                        <Card.Title>{currentServiceDetails.Nombre}</Card.Title>
                        <Card.Text>
                          <p className="mb-1">
                            {currentServiceDetails.Descripcion}
                          </p>
                          <p className="mb-1">
                            Duración: {currentServiceDetails.DuracionMinutos}{" "}
                            minutos
                          </p>
                          <p className="mb-0">
                            Precio: ${currentServiceDetails.Precio}
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
        </Col>
      </Row>
    </Container>
  );
};

export default CreateAppointmentForm;

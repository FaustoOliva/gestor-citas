import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { getSpecies, getServices } from "../../services/front.js";

export const filterAppointments = (appointments, filters) => {
  // Lógica de filtrado
  if (filters.date) {
    appointments = appointments.filter(
      (app) => app?.date.slice(0, 10) == filters.date
    );
  }
  if (filters.status) {
    appointments = appointments.filter((app) => app?.status == filters.status);
  }
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    appointments = appointments.filter((app) =>
      app?.user.name.toLowerCase().includes(searchTerm)
    );
  }
  if (filters.species) {
    appointments = appointments.filter(
      (app) => app?.pet.specieName == filters.species
    );
  }
  if (filters.service) {
    appointments = appointments.filter(
      (app) => app?.service.name == filters.service
    );
  }

  return appointments;
};

export const Filters = ({ filters, onFilterChange }) => {
  const [species, setSpecies] = useState([]);
  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const species = await getSpecies();
        const services = await getServices();
        setSpecies(species);
        setServices(services);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title>Filtros</Card.Title>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Filtrar por fecha</Form.Label>
                <Form.Select
                  name="dateFilterType"
                  value={filters.dateFilterType || ""}
                  onChange={onFilterChange}
                >
                  <option value="">Seleccionar opción...</option>
                  <option value="today">Hoy</option>
                  <option value="yesterday">Ayer</option>
                  <option value="last7">Últimos 7 días</option>
                  <option value="thisWeek">Esta semana</option>
                  <option value="custom">Rango personalizado</option>
                </Form.Select>
              </Form.Group>
              {filters.dateFilterType === "custom" && (
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha inicio</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={filters.startDate || ""}
                        onChange={onFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha fin</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={filters.endDate || ""}
                        onChange={onFilterChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={onFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Completada">Completada</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Buscar</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Nombre dueño..."
                  value={filters.search}
                  onChange={onFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Especie</Form.Label>
                <Form.Select
                  name="species"
                  value={filters.species}
                  onChange={onFilterChange}
                >
                  <option value="">Seleccionar especie...</option>
                  {/* Aquí puedes mapear las especies obtenidas desde el backend */}
                  {species.map((specie) => (
                    <option key={specie.id} value={specie.name}>
                      {specie.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Servicios</Form.Label>
                <Form.Select
                  name="services"
                  value={filters.services}
                  onChange={onFilterChange}
                >
                  <option value="">Seleccionar servicio...</option>
                  {/* Aquí puedes mapear los servicios obtenidos desde el backend */}
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

Filters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

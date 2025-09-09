import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

const AppsTable = ({
  appointments,
  handleStatusUpdate,
  confirmDelete,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

    const getStatusVariant = (status) => {
    switch (status) {
      case "Pendiente":
        return "warning";
      case "Confirmada":
        return "primary";
      case "Completada":
        return "success";
      case "Cancelada":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Table striped bordered hover responsive className="shadow-sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Especie</th>
          <th>Dueño</th>
          <th>Servicio</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {appointments.length > 0 ? (
          appointments.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.pet.specieName}</td>
              <td>{app.user.name}</td>
              <td>{app.service.name}</td>
              <td>{formatDate(app.date)}</td>
              <td>
                <Badge bg={getStatusVariant(app.status)}>
                  {app.status.toUpperCase()}
                </Badge>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleStatusUpdate(app.id, "Confirmada")}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleStatusUpdate(app.id, "Confirmada")}
                  >
                    Confirmar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => confirmDelete(app)}
                  >
                    Cancelar
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center">
              No se encontraron citas.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

AppsTable.propTypes = {
  appointments: PropTypes.array.isRequired,
  handleStatusUpdate: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
};

export default AppsTable;

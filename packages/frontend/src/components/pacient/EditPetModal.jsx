import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditPetModal = ({
  show,
  handleClose,
  petToEdit,
  setPetToEdit,
  handleSave,
}) => {
    console.log(petToEdit)
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Mascota</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {petToEdit && (
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={petToEdit.name ?? ""}
                placeholder={petToEdit.name}
                onChange={(e) =>
                  setPetToEdit({ ...petToEdit, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                type="text"
                value={petToEdit.breed ?? ""}
                onChange={(e) =>
                  setPetToEdit({ ...petToEdit, breed: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  value={petToEdit.birthDate ?? ""}
                  onChange={(e) =>
                    setPetToEdit({
                      ...petToEdit,
                      birthDate: e.target.value,
                    })
                  }
                />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tamaño</Form.Label>
              <Form.Select
                value={petToEdit.size ?? ""}
                onChange={(e) =>
                  setPetToEdit({ ...petToEdit, size: e.target.value })
                }
              >
                <option value="">Selecciona un tamaño</option>
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Peso</Form.Label>
              <Form.Control
                type="number"
                value={petToEdit.weight ?? ""}
                onChange={(e) =>
                  setPetToEdit({ ...petToEdit, weight: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Guardar cambios
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditPetModal;

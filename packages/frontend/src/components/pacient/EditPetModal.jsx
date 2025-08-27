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
                value={petToEdit.Pet_Name ?? ""}
                placeholder={petToEdit.Pet_Name}
                onChange={(e) =>
                  setPetToEdit({ ...petToEdit, Pet_Name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                type="text"
                value={petToEdit.Pet_Breed ?? ""}
                onChange={(e) =>
                  setPetToEdit({ ...petToEdit, Pet_Breed: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  value={petToEdit.Pet_Pet_BirthDate ?? ""}
                  onChange={(e) =>
                    setPetToEdit({
                      ...petToEdit,
                      Pet_Pet_BirthDate: e.target.value,
                    })
                  }
                />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tamaño</Form.Label>
              <Form.Select
                value={petToEdit.Pet_Size ?? ""}
                onChange={(e) =>
                  setPetToEdit({ ...petToEdit, Pet_Size: e.target.value })
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
                value={petToEdit.Pet_Weight ?? ""}
                onChange={(e) =>
                  setPetToEdit({ ...petToEdit, Pet_Weight: e.target.value })
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

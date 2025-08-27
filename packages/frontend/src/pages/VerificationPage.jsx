import React from "react";
import { Container } from "react-bootstrap";
import VerifyForm from "../components/VerifyForm";

const VerifyPage = () => {
  return (
    <Container className="py-5 text-center">
      <h4 className="mb-4">
        Se ha enviado un correo al mail registrado para verificarlo.
        <br />
        Por favor, ingrese el código de 6 dígitos.
      </h4>
      <VerifyForm />
    </Container>
  );
};

export default VerifyPage;

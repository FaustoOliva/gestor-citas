import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra el título principal', () => {
  render(<App />);
  const titulo = screen.getByText(/administrador de pacientes/i);
  expect(titulo).toBeInTheDocument();
});
test('muestra el formulario de citas', () => {
  render(<App />);
  const formulario = screen.getByText(/crear mi cita/i);
  expect(formulario).toBeInTheDocument();
});
test('muestra la sección de citas', () => {
  render(<App />);
  const citas = screen.getByText(/administra tus citas/i);
  expect(citas).toBeInTheDocument();
});

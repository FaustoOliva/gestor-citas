import { apiCall } from "./apiCall";

export async function createAppointment(appointmentData) {
  return apiCall('/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });
}

export async function getAppointmentById(appointmentId) {
  return apiCall(`/appointments/${appointmentId}`, {
    method: 'GET'
  });
}

export async function getAppointmentsByPetId(petId) {
  return apiCall(`/appointments/pets/${petId}`, {
    method: 'GET'
  });
}

export async function getAppointments() {
  return apiCall('/appointments', {
    method: 'GET'
  });
}

export async function updateAppointment(appointmentId, appointmentData) {
  return apiCall(`/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });
}

export async function deleteAppointment(appointmentId) {
  return apiCall(`/appointments/${appointmentId}`, {
    method: 'DELETE'
  });
}
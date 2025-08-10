import { apiCall } from "./apiCall";

export async function getSpecies() {
  return apiCall('/appointments/species', {
    method: 'GET'
  });
}

export async function getServicesBySpecie(specieId) {
  return apiCall(`/appointments/services/${specieId}`, {
    method: 'GET'
  });
}

export async function createAppointment(appointmentData) {
  return apiCall('/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });
}

export async function getAppointmentsByUser(userId) {
  return apiCall(`/appointments/user/${userId}`, {
    method: 'GET'
  });
}
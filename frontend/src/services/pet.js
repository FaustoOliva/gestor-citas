import { apiCall } from "./apiCall";

export async function getPets() {
  return apiCall('/pets', {
    method: 'GET'
  });
}

export async function getPetById(petId) {
  return apiCall(`/pets/${petId}`, {
    method: 'GET'
  });
}

export async function createPet(petData) {
  console.log(petData)
  return apiCall('/pets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(petData)
  });
}

export async function updatePet(petId, petData) {
  return apiCall(`/pets/${petId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(petData)
  });
}

export async function deletePet(petId) {
  return apiCall(`/pets/${petId}`, {
    method: 'DELETE'
  });
}

export async function getPetsByUser(userId) {
    return apiCall(`/pets/users/${userId}`, {
        method: 'GET'
    });
}
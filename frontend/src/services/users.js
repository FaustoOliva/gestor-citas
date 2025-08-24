import { apiCall } from "./apiCall";

export async function getUsers() {
  return apiCall('/users', {
    method: 'GET'
  });
}

export async function getUserById(userId) {
  return apiCall(`/users/${userId}`, {
    method: 'GET'
  });
}

export async function updateUser(userId, userData) {
  return apiCall(`/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
}

export async function deleteUser(userId) {
  return apiCall(`/users/${userId}`, {
    method: 'DELETE'
  });
}
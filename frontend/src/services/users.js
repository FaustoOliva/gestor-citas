import { apiCall } from "./apiCall";

export async function getAllUsers() {
  return apiCall('/pacients/allUsers', {
    method: 'GET'
  });
}

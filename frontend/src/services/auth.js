import { apiCall } from "./apiCall";

export async function logInUser(credentials) {
  return apiCall('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
}

export async function registerUser(user) {
  return apiCall('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
}

export async function sendMailConfirmation(email) {
  return apiCall(`/auth/send-mail-confirmation/${email}`, {
    method: 'GET'
  });
}

export async function verifyEmail(email, code) {
  return apiCall(`/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, code })
  });
}
const host = process.env.REACT_APP_API_URL;

const apiCall = async (endpoint, options) => {
    const response = await fetch(`${host}${endpoint}`, options);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Algo salió mal');
    }
    return await response.json();
};

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
  return apiCall(`/send-mail-confirmation/${email}`, {
    method: 'GET'
  });
}

export async function verifyEmail(email, code) {
  return apiCall(`/verify-email/${email}/${code}`, {
    method: 'GET'
  });
}
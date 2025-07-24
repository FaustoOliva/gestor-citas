export async function autenticarUsuario(credentials) {
  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al autenticar');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
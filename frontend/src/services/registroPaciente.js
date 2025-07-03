export async function registrarPaciente(paciente) {
  try {
    const response = await fetch('http://localhost:5000/pacientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paciente)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrar');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

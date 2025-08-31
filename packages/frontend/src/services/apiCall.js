const host = process.env.REACT_APP_API_URL;

export const apiCall = async (endpoint, options) => {
  const response = await fetch(`${host}${endpoint}`, options);
  if (response.status === 204) {
    return null;
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Algo salió mal");
  }
  return await response.json();
};

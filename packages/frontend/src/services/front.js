import { apiCall } from "./apiCall";

export async function getSpecies() {
  return apiCall("/front/species", {
    method: "GET",
  });
}

export async function getServicesBySpecie(specieId) {
  return apiCall(`/front/services/species/${specieId}`, {
    method: "GET",
  });
}

export async function getServices() {
  return apiCall("/front/services", {
    method: "GET",
  });
}

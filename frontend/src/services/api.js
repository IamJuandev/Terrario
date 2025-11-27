// CÓDIGO NUEVO (Corrección forzada):
const API_URL = 'http://149.130.164.160:3001/api';
//const API_URL = 'http://localhost:3001/api';

export const getBusinesses = async () => {
  const response = await fetch(`${API_URL}/businesses`);
  if (!response.ok) throw new Error('Failed to fetch businesses');
  return response.json();
};

export const getBusiness = async (id) => {
  const response = await fetch(`${API_URL}/businesses/${id}`);
  if (!response.ok) throw new Error('Failed to fetch business');
  return response.json();
};

export const createBusiness = async (data) => {
  const isFormData = data instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const body = isFormData ? data : JSON.stringify(data);

  const response = await fetch(`${API_URL}/businesses`, {
    method: 'POST',
    headers,
    body,
  });
  if (!response.ok) throw new Error('Failed to create business');
  return response.json();
};

export const updateBusiness = async (id, data) => {
  const isFormData = data instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const body = isFormData ? data : JSON.stringify(data);

  const response = await fetch(`${API_URL}/businesses/${id}`, {
    method: 'PUT',
    headers,
    body,
  });
  if (!response.ok) throw new Error('Failed to update business');
  return response.json();
};

export const deleteBusiness = async (id) => {
  const response = await fetch(`${API_URL}/businesses/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete business');
  return response.json();
};

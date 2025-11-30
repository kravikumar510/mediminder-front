import { LoginData, RegisterData, MedicineData, AuthResponse, Medicine } from '../types';

const API_URL = "https://mediminder-backend-ks06.onrender.com";

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response: Response) => {
  let text = '';
  try {
    text = await response.text();
  } catch (error) {
    throw new Error("Network error: Failed to read response from server.");
  }

  let data;
  try {
    data = text ? JSON.parse(text) : {}; 
  } catch {
    const lowerText = text.toLowerCase().trim();
    if (lowerText.startsWith('<!doctype') || lowerText.startsWith('<html')) {
       if (response.status === 404) {
          throw new Error("Server endpoint not found (404). Please contact support.");
       }
       if (response.status === 500) {
          throw new Error("Internal Server Error (500). Please try again later.");
       }
       throw new Error(`Server returned an invalid HTML response (${response.status}).`);
    }
    throw new Error(`Invalid response format: ${text.substring(0, 50)}...`);
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const payload: any = {
    username: data.username,
    name: data.username,
    password: data.password
  };

  if (data.email) payload.email = data.email;
  if (data.phone) payload.phone = data.phone;

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await handleResponse(response);
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await handleResponse(response);
};

export const forgotPassword = async (email: string): Promise<any> => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return await handleResponse(response);
};

export const addMedicine = async (data: MedicineData): Promise<Medicine> => {
  const response = await fetch(`${API_URL}/medicines`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return await handleResponse(response);
};

export const getMedicines = async (): Promise<Medicine[]> => {
  const response = await fetch(`${API_URL}/medicines`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return await handleResponse(response);
};

export const updateMedicine = async (id: string, data: Partial<MedicineData>): Promise<Medicine> => {
  const response = await fetch(`${API_URL}/medicines/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return await handleResponse(response);
};

export const deleteMedicine = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/medicines/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  await handleResponse(response);
};

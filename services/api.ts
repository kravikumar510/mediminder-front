const API_URL = "https://mediminder-backend-ks06.onrender.com";

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

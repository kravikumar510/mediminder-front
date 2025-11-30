// services/api.ts

const BASE_URL = import.meta.env.VITE_API_URL + "/api";

// Helper function for requests
async function request(endpoint: string, method = "GET", data?: any, token?: string) {
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  return res.json();
}

/* -------------------------
   AUTH
-------------------------- */
export function login(data: { email: string; password: string }) {
  return request("/auth/login", "POST", data);
}

export function register(data: { name: string; email?: string; password: string }) {
  return request("/auth/register", "POST", data);
}

export function forgotPassword(email: string) {
  return request("/auth/forgot-password", "POST", { email });
}

/* -------------------------
   PROFILE
-------------------------- */
export function getProfile(token: string) {
  return request("/user/profile", "GET", undefined, token);
}

export function updateProfile(token: string, data: any) {
  return request("/user/profile", "PUT", data, token);
}

/* -------------------------
   MEDICINES
-------------------------- */
export function getMedicines(token: string) {
  return request("/medicine", "GET", undefined, token);
}

export function addMedicine(token: string, data: any) {
  return request("/medicine", "POST", data, token);
}

export function updateMedicine(token: string, id: string, data: any) {
  return request(`/medicine/${id}`, "PUT", data, token);
}

export function deleteMedicine(token: string, id: string) {
  return request(`/medicine/${id}`, "DELETE", undefined, token);
}

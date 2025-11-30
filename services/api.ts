// services/api.ts

const BASE_URL = import.meta.env.VITE_API_URL + "/api";

// Helper function
async function request(endpoint: string, method = "GET", data?: any) {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
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

export function register(data: { name: string; email: string; password: string }) {
  return request("/auth/register", "POST", data);
}

export function forgotPassword(email: string) {
  return request("/auth/forgot-password", "POST", { email });
}

/* -------------------------
   PROFILE
-------------------------- */
export function getProfile(token: string) {
  return fetch(`${BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export function updateProfile(token: string, data: any) {
  return fetch(`${BASE_URL}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

/* -------------------------
   MEDICINES
-------------------------- */
export function getMedicines(token: string) {
  return fetch(`${BASE_URL}/medicine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export function addMedicine(token: string, data: any) {
  return fetch(`${BASE_URL}/medicine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export function updateMedicine(token: string, id: string, data: any) {
  return fetch(`${BASE_URL}/medicine/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export function deleteMedicine(token: string, id: string) {
  return fetch(`${BASE_URL}/medicine/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

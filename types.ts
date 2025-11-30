export interface User {
  _id: string;
  id?: string;
  username: string;
  name?: string;
  email?: string;
  token?: string;
  avatar?: string;
}

export type MedicineType =
  | 'Tablet'
  | 'Capsule'
  | 'Syrup'
  | 'Injection'
  | 'Drops'
  | 'Inhaler'
  | 'Cream'
  | 'Other';

export interface Medicine {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  type?: MedicineType;
  user: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  username: string;   // 🔥 FIXED: backend uses username, not email
  password: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  phone?: string;
}

export interface MedicineData {
  name: string;
  dosage: string;
  frequency: string;
  type?: string;
  user: string;
}

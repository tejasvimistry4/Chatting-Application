export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  avatar?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

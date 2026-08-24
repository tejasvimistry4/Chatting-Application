import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";

import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
  UpdateProfilePayload,
} from "../types/auth";

export const loginApi = async (payload: LoginPayload) => {
  const response = await api.post<AuthResponse>(
    API_ENDPOINTS.auth.login,
    payload,
  );

  return response.data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const response = await api.post<AuthResponse>(
    API_ENDPOINTS.auth.register,
    payload,
  );

  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: User;
  }>(API_ENDPOINTS.auth.profile);

  return response.data;
};

export const updateProfileApi = async (payload: UpdateProfilePayload) => {
  const response = await api.put<{
    success: boolean;
    message: string;
    data: User;
  }>(API_ENDPOINTS.auth.profile, payload);

  return response.data;
};

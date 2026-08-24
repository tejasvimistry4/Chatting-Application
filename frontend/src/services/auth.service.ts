import { loginApi, registerApi, updateProfileApi } from "../api/auth.api";

import { STORAGE_KEYS } from "../constants/storageKeys";

import {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "../types/auth";

export const login = async (payload: LoginPayload) => {
  const result = await loginApi(payload);

  localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.accessToken);

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data.user));

  return result;
};

export const register = async (payload: RegisterPayload) => {
  const result = await registerApi(payload);

  localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.accessToken);

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data.user));

  return result;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<User> => {
  const result = await updateProfileApi(payload);

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data));
  return result.data;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);

  localStorage.removeItem(STORAGE_KEYS.USER);
};

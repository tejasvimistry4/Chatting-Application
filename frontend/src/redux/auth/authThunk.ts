import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../../api/auth.api";
import { LoginPayload, RegisterPayload } from "../../types/auth";
import { STORAGE_KEYS } from "../../constants/storageKeys";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);

      const { accessToken, user } = response.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return {
        accessToken,
        user,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await registerApi(payload);

      const { accessToken, user } = response.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return {
        accessToken,
        user,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed.",
      );
    }
  },
);

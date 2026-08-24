import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../../types/auth";
import { loginThunk, registerThunk } from "../auth/authThunk";
import { STORAGE_KEYS } from "../../constants/storageKeys";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const getInitialAuth = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

  if (!token || !storedUser) {
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
    };
  }

  try {
    const user: User = JSON.parse(storedUser);

    return {
      user,
      accessToken: token,
      isAuthenticated: true,
      loading: false,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);

    localStorage.removeItem(STORAGE_KEYS.USER);

    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
    };
  }
};

const initialState: AuthState = getInitialAuth();

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;

      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) {
        return;
      }

      state.user = {
        ...state.user,
        ...action.payload,
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
      })

      .addCase(loginThunk.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
      })

      .addCase(registerThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, setAuthLoading, setUser, updateUser } =
  authSlice.actions;

export default authSlice.reducer;

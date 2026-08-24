import { RootState } from "../store";

export const selectUser = (state: RootState) => state.auth.user;

export const selectToken = (state: RootState) => state.auth.accessToken;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectAuthLoading = (state: RootState) => state.auth.loading;

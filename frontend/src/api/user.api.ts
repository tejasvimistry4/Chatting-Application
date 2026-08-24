import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";

import { PaginatedUsers, UserSearchParams } from "../types/chat";

export const searchUsersApi = async (params: UserSearchParams) => {
  const response = await api.get<{
    success: boolean;
    data: PaginatedUsers;
  }>(API_ENDPOINTS.users.search, {
    params,
  });

  return response.data;
};

export const updateProfileApi = async (payload: {
  avatar?: string;
  fullName?: string;
}) => {
  const response = await api.patch("/users/profile", payload);

  return response.data;
};

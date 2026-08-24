import { searchUsersApi } from "../api/user.api";

export const searchUsers = async (search: string, page = 1, limit = 10) => {
  return searchUsersApi({
    search,
    page,
    limit,
  });
};

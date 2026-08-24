import userRepository from "./user.repository";

export const searchUsersService = async (
  search: string,
  currentUserId: string,
  page: number,
  limit: number,
) => {
  const normalizedSearch = search.trim();
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.min(Math.max(1, limit), 50);

  const skip = (normalizedPage - 1) * normalizedLimit;

  const { users, total } = await userRepository.searchUsers(
    normalizedSearch,
    currentUserId,
    skip,
    normalizedLimit,
  );

  const totalPages = Math.ceil(total / normalizedLimit);

  return {
    items: users,
    page: normalizedPage,
    limit: normalizedLimit,
    total,
    totalPages,
  };
};

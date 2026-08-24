import prisma from "../../database/prisma";

class UserRepository {
  searchUsers = async (
    search: string,
    currentUserId: string,
    skip: number,
    take: number,
  ) => {
    const where = {
      id: {
        not: currentUserId,
      },

      OR: [
        {
          fullName: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          avatar: true,
          createdAt: true,
        },

        orderBy: {
          fullName: "asc",
        },
        skip,
        take,
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
    };
  };
}

export default new UserRepository();

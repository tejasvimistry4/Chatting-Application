import prisma from "../../database/prisma";

class AuthRepository {
  findUserByEmail = (email: string) =>
    prisma.user.findUnique({
      where: { email },
    });

  createUser = (data: { fullName: string; email: string; password: string }) =>
    prisma.user.create({
      data,
    });

  findUserById = (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

  updateUser = (
    id: string,
    data: {
      fullName?: string;
      avatar?: string | null;
    },
  ) =>
    prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        isOnline: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  async findMany(ids: string[]) {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}

export default new AuthRepository();

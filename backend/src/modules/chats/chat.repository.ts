import prisma from "../../database/prisma";

class ChatRepository {
  async findById(chatId: string) {
    return prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatar: true,
                isOnline: true,
              },
            },
          },
        },
      },
    });
  }

  async findChat(chatId: string) {
    return prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        id: true,
        type: true,
        createdBy: true,
      },
    });
  }

  async findPrivateChat(user1: string, user2: string) {
    return prisma.chat.findFirst({
      where: {
        type: "PRIVATE",
        members: {
          every: {
            userId: {
              in: [user1, user2],
            },
          },
        },
      },
    });
  }

  async createPrivateChat(createdBy: string) {
    return prisma.chat.create({
      data: {
        createdBy,

        type: "PRIVATE",
      },
    });
  }

  async getUserChats(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      members: {
        some: {
          userId,
        },
      },
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                members: {
                  some: {
                    user: {
                      fullName: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.chat.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  avatar: true,
                  isOnline: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
      }),
      prisma.chat.count({
        where,
      }),
    ]);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getChatById(
    chatId: string,
    userId: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const membership = await prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
    });
    if (!membership) {
      return null;
    }

    const [chat, totalMessages] = await prisma.$transaction([
      prisma.chat.findUnique({
        where: {
          id: chatId,
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  avatar: true,
                  isOnline: true,
                },
              },
            },
          },

          messages: {
            orderBy: {
              createdAt: "desc",
            },
            skip,
            take: limit,
            include: {
              sender: {
                select: {
                  id: true,
                  fullName: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),

      prisma.message.count({
        where: {
          chatId,
        },
      }),
    ]);

    return {
      chat,
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
      },
    };
  }

  async getOtherMember(chatId: string, currentUserId: string) {
    return prisma.chatMember.findFirst({
      where: {
        chatId,
        userId: {
          not: currentUserId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            email: true,
            isOnline: true,
          },
        },
      },
    });
  }

  async isMember(chatId: string, userId: string) {
    return prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
      select: {
        chatId: true,
        userId: true,
      },
    });
  }
}

export default new ChatRepository();

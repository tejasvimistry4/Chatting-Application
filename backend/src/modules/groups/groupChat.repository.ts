import prisma from "../../database/prisma";

class GroupChatRepository {
  async findById(chatId: string) {
    return prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });
  }

  async createGroup(name: string, createdBy: string) {
    return prisma.chat.create({
      data: {
        name,
        type: "GROUP",
        createdBy,
      },
    });
  }

  async findMember(chatId: string, userId: string) {
    return prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
    });
  }

  async getFullChat(chatId: string) {
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

  async addMembers(
    chatId: string,
    members: {
      userId: string;
      isAdmin?: boolean;
    }[],
  ) {
    await prisma.chatMember.createMany({
      data: members.map((member) => ({
        chatId,
        userId: member.userId,
        isAdmin: member.isAdmin ?? false,
      })),
      skipDuplicates: true,
    });
    return this.getFullChat(chatId);
  }

  async renameGroup(chatId: string, name: string) {
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        name,
      },
    });
    return this.getFullChat(chatId);
  }

  async removeMember(chatId: string, userId: string) {
    await prisma.chatMember.delete({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
    });
    return this.getFullChat(chatId);
  }

  async countMembers(chatId: string) {
    return prisma.chatMember.count({
      where: {
        chatId,
      },
    });
  }

  async countAdmins(chatId: string) {
    return prisma.chatMember.count({
      where: {
        chatId,
        isAdmin: true,
      },
    });
  }

  async makeAdmin(chatId: string, userId: string) {
    return prisma.chatMember.update({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
      data: {
        isAdmin: true,
      },
    });
  }

  async getMembers(chatId: string) {
    return prisma.chatMember.findMany({
      where: {
        chatId,
      },
      include: {
        user: true,
      },
    });
  }

  async leaveGroup(chatId: string, userId: string) {
    await prisma.chatMember.delete({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
    });
    return this.getFullChat(chatId);
  }

  async deleteChat(chatId: string) {
    return prisma.chat.delete({
      where: {
        id: chatId,
      },
    });
  }
}

export default new GroupChatRepository();

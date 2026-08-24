import prisma from "../../database/prisma";

interface CreateMessageData {
  chatId: string;
  senderId: string;
  content?: string;
  type: "TEXT" | "IMAGE" | "FILE";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

class MessageRepository {
  async createMessage(data: CreateMessageData) {
    return prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          chatId: data.chatId,
          senderId: data.senderId,
          content: data.content,
          type: data.type,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              avatar: true,
            },
          },
        },
      });

      await tx.chat.update({
        where: {
          id: data.chatId,
        },
        data: {
          lastMessageId: message.id,
          lastMessageAt: message.createdAt,
        },
      });

      return message;
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
    });
  }

  async getChatMembers(chatId: string) {
    return prisma.chatMember.findMany({
      where: {
        chatId,
      },
      select: {
        userId: true,
      },
    });
  }

  async findById(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });
  }

  async markAsRead(messageId: string, userId: string) {
    return prisma.messageRead.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId,
        },
      },
      create: {
        messageId,
        userId,
      },
      update: {
        readAt: new Date(),
      },
    });
  }

  async findMessage(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        chatId: true,
      },
    });
  }

  async getMessages(chatId: string, cursor?: string, limit = 30) {
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      take: limit + 1,
      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
            skip: 1,
          }
        : {}),

      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
        reads: {
          select: {
            userId: true,
            readAt: true,
          },
        },
      },
    });

    const hasMore = messages.length > limit;

    const items = hasMore ? messages.slice(0, limit) : messages;

    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }
}

export default new MessageRepository();

import { Prisma } from "@prisma/client";
import prisma from "../../database/prisma";
import chatRepository from "./chat.repository";
import authRepository from "../auth/auth.repository";
import { ApiError } from "../../utils/ApiError";
import { STATUS } from "../../constants/statusCodes";
import { MESSAGE } from "../../constants/messages";

class ChatService {
  async createPrivateChat(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.PRIVATE_CHAT_SELF_ERROR);
    }

    const targetUser = await authRepository.findUserById(targetUserId);
    if (!targetUser) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.TARGET_USER_NOT_FOUND);
    }

    const existingChat = await chatRepository.findPrivateChat(
      currentUserId,
      targetUserId,
    );
    if (existingChat) {
      return existingChat;
    }

    return prisma.$transaction(async (tx) => {
      const chat = await tx.chat.create({
        data: {
          type: "PRIVATE",
          createdBy: currentUserId,
        },
      });

      await tx.chatMember.createMany({
        data: [
          {
            chatId: chat.id,
            userId: currentUserId,
            isAdmin: true,
          },
          {
            chatId: chat.id,
            userId: targetUserId,
          },
        ],
      });

      return tx.chat.findUnique({
        where: {
          id: chat.id,
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
    });
  }

  async getChats(userId: string, page: number, limit: number, search?: string) {
    return chatRepository.getUserChats(userId, page, limit, search);
  }

  async getChatById(userId: string, chatId: string, page = 1, limit = 30) {
    const chat = await chatRepository.getChatById(chatId, userId, page, limit);

    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.CHAT_NOT_FOUND);
    }
    return chat;
  }

  async assertMember(chatId: string, userId: string) {
    const member = await chatRepository.isMember(chatId, userId);

    if (!member) {
      throw new ApiError(
        STATUS.FORBIDDEN,
        "You are not a member of this chat.",
      );
    }
    return true;
  }
}

export default new ChatService();

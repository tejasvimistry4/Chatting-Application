import { Prisma } from "@prisma/client";
import prisma from "../../database/prisma";
import groupChatRepository from "./groupChat.repository";
import anthRepository from "../auth/auth.repository";
import { ApiError } from "../../utils/ApiError";
import { STATUS } from "../../constants/statusCodes";
import { MESSAGE } from "../../constants/messages";
import { getIO } from "../../socket/socket.server";

class GroupChatService {
  async createGroupChat(
    currentUserId: string,
    name: string,
    members: string[],
  ) {
    const uniqueMembers = [...new Set(members)];

    if (!uniqueMembers.includes(currentUserId)) {
      uniqueMembers.push(currentUserId);
    }

    if (uniqueMembers.length < 2) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_MIN_MEMBERS);
    }

    if (!name?.trim()) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_NAME_REQUIRED);
    }

    const users = await anthRepository.findMany(uniqueMembers);

    if (users.length !== uniqueMembers.length) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.USERS_NOT_FOUND);
    }

    const chat = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const createdChat = await tx.chat.create({
          data: {
            name: name.trim(),
            type: "GROUP",
            createdBy: currentUserId,
          },
        });

        await tx.chatMember.createMany({
          data: uniqueMembers.map((userId) => ({
            chatId: createdChat.id,
            userId,
            isAdmin: userId === currentUserId,
          })),
        });

        return tx.chat.findUnique({
          where: {
            id: createdChat.id,
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
      },
    );

    if (!chat) {
      throw new ApiError(
        STATUS.INTERNAL_SERVER_ERROR,
        "Unable to create group chat.",
      );
    }

    const io = getIO();

    for (const member of chat.members) {
      io.to(`user:${member.userId}`).emit("chat-created", chat);
    }

    return chat;
  }

  private emitGroupUpdated(chat: any) {
    if (!chat) {
      return;
    }
    const io = getIO();
    for (const member of chat.members) {
      io.to(`user:${member.userId}`).emit("group-updated", chat);
    }
  }

  private emitGroupMemberEvent(
    event: "group-member-added" | "group-member-removed" | "group-member-left",
    chat: any,
    memberId: string,
  ) {
    const io = getIO();

    if (chat) {
      for (const member of chat.members) {
        io.to(`user:${member.userId}`).emit(event, {
          chat,
          chatId: chat.id,
          memberId,
        });
      }
    }
    io.to(`user:${memberId}`).emit(event, {
      chat: null,
      chatId: chat?.id,
      memberId,
      removedUserId: memberId,
    });
  }

  async renameGroup(currentUserId: string, chatId: string, name: string) {
    if (!name.trim()) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_NAME_REQUIRED);
    }

    const chat = await groupChatRepository.findById(chatId);
    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.CHAT_NOT_FOUND);
    }
    if (chat.type !== "GROUP") {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_ONLY_RENAME);
    }

    const member = await groupChatRepository.findMember(chatId, currentUserId);
    if (!member) {
      throw new ApiError(STATUS.FORBIDDEN, MESSAGE.GROUP_NOT_MEMBER);
    }
    if (!member.isAdmin) {
      throw new ApiError(STATUS.FORBIDDEN, MESSAGE.GROUP_ADMIN_ONLY_RENAME);
    }

    const updatedChat = await groupChatRepository.renameGroup(
      chatId,
      name.trim(),
    );

    this.emitGroupUpdated(updatedChat);
    return updatedChat;
  }

  async addMembers(currentUserId: string, chatId: string, members: string[]) {
    if (!members.length) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_MEMBER_REQUIRED);
    }

    const chat = await groupChatRepository.findById(chatId);
    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.CHAT_NOT_FOUND);
    }
    if (chat.type !== "GROUP") {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_ONLY_ADD_MEMBERS);
    }

    const admin = await groupChatRepository.findMember(chatId, currentUserId);
    if (!admin?.isAdmin) {
      throw new ApiError(STATUS.FORBIDDEN, MESSAGE.GROUP_ADMIN_ONLY_ADD);
    }

    const uniqueMembers = [...new Set(members)];

    const users = await anthRepository.findMany(uniqueMembers);
    if (users.length !== uniqueMembers.length) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.USERS_NOT_EXIST);
    }

    const updatedChat = await groupChatRepository.addMembers(
      chatId,
      uniqueMembers.map((id) => ({
        userId: id,
      })),
    );

    if (!updatedChat) {
      throw new ApiError(
        STATUS.INTERNAL_SERVER_ERROR,
        "Unable to update group.",
      );
    }

    this.emitGroupUpdated(updatedChat);

    const io = getIO();

    for (const memberId of uniqueMembers) {
      io.to(`user:${memberId}`).emit("group-member-added", {
        chat: updatedChat,
        chatId,
        memberId,
      });
    }
    return updatedChat;
  }

  async removeMember(currentUserId: string, chatId: string, memberId: string) {
    const chat = await groupChatRepository.findById(chatId);
    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.CHAT_NOT_FOUND);
    }
    if (chat.type !== "GROUP") {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_ONLY_REMOVE_MEMBERS);
    }
    const admin = await groupChatRepository.findMember(chatId, currentUserId);
    if (!admin?.isAdmin) {
      throw new ApiError(STATUS.FORBIDDEN, MESSAGE.GROUP_ADMIN_ONLY_REMOVE);
    }

    const member = await groupChatRepository.findMember(chatId, memberId);
    if (!member) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.GROUP_MEMBER_NOT_FOUND);
    }
    if (member.userId === currentUserId) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_USE_LEAVE);
    }

    const updatedChat = await groupChatRepository.removeMember(
      chatId,
      memberId,
    );
    this.emitGroupMemberEvent("group-member-removed", updatedChat, memberId);

    return updatedChat;
  }

  async leaveGroup(currentUserId: string, chatId: string) {
    const chat = await groupChatRepository.findById(chatId);
    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.CHAT_NOT_FOUND);
    }
    if (chat.type !== "GROUP") {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_ONLY_LEAVE);
    }

    const member = await groupChatRepository.findMember(chatId, currentUserId);
    if (!member) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.GROUP_NOT_MEMBER);
    }

    const totalMembers = await groupChatRepository.countMembers(chatId);
    if (totalMembers === 1) {
      await groupChatRepository.deleteChat(chatId);

      const io = getIO();
      io.to(`user:${currentUserId}`).emit("group-deleted", {
        chatId,
      });
      return;
    }

    if (member.isAdmin) {
      const admins = await groupChatRepository.countAdmins(chatId);

      if (admins === 1) {
        const members = await groupChatRepository.getMembers(chatId);

        const nextAdmin = members.find((m) => m.userId !== currentUserId);
        if (nextAdmin) {
          await groupChatRepository.makeAdmin(chatId, nextAdmin.userId);
        }
      }
    }

    const updatedChat = await groupChatRepository.leaveGroup(
      chatId,
      currentUserId,
    );

    this.emitGroupMemberEvent("group-member-left", updatedChat, currentUserId);
  }

  async deleteGroup(currentUserId: string, chatId: string) {
    const chat = await groupChatRepository.findById(chatId);
    if (!chat) {
      throw new ApiError(STATUS.NOT_FOUND, MESSAGE.CHAT_NOT_FOUND);
    }
    if (chat.type !== "GROUP") {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.GROUP_ONLY_DELETE);
    }
    if (chat.createdBy !== currentUserId) {
      throw new ApiError(STATUS.FORBIDDEN, MESSAGE.GROUP_CREATOR_ONLY_DELETE);
    }

    const members = await groupChatRepository.getMembers(chatId);

    await groupChatRepository.deleteChat(chatId);

    const io = getIO();

    for (const member of members) {
      io.to(`user:${member.userId}`).emit("group-deleted", {
        chatId,
      });
    }
  }
}

export default new GroupChatService();

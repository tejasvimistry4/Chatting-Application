import {
  getChatsApi,
  getChatApi,
  createPrivateChatApi,
  createGroupChatApi,
  renameGroupApi,
  addGroupMembersApi,
  removeGroupMemberApi,
  leaveGroupApi,
  deleteGroupApi,
} from "../api/chat.api";

import {
  CreateGroupChatPayload,
  CreatePrivateChatPayload,
} from "../types/chat";

export const getChats = async (page = 1, limit = 20) => {
  return getChatsApi(page, limit);
};

export const getChat = async (chatId: string) => {
  return getChatApi(chatId);
};

export const createPrivateChat = async (payload: CreatePrivateChatPayload) => {
  return createPrivateChatApi(payload);
};

export const createGroupChat = async (payload: CreateGroupChatPayload) => {
  return createGroupChatApi(payload);
};

export const renameGroup = async (chatId: string, name: string) => {
  return renameGroupApi(chatId, {
    name,
  });
};

export const addGroupMembers = async (chatId: string, members: string[]) => {
  return addGroupMembersApi(chatId, {
    members,
  });
};

export const removeGroupMember = async (chatId: string, memberId: string) => {
  return removeGroupMemberApi(chatId, memberId);
};

export const leaveGroup = async (chatId: string) => {
  return leaveGroupApi(chatId);
};

export const deleteGroup = async (chatId: string) => {
  return deleteGroupApi(chatId);
};

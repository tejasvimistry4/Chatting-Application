import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";

import {
  Chat,
  CreatePrivateChatPayload,
  CreateGroupChatPayload,
  PaginatedChats,
  RenameGroupPayload,
  AddGroupMembersPayload,
} from "../types/chat";

export const getChatsApi = async (page = 1, limit = 20) => {
  const response = await api.get<{
    success: boolean;
    data: PaginatedChats;
  }>(API_ENDPOINTS.chats.list, {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const getChatApi = async (chatId: string) => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: {
      chat: Chat;
    };
  }>(API_ENDPOINTS.chats.byId(chatId));

  return response.data;
};

export const createPrivateChatApi = async (
  payload: CreatePrivateChatPayload,
) => {
  const response = await api.post<{
    success: boolean;
    data: Chat;
  }>(API_ENDPOINTS.chats.private, payload);

  return response.data;
};

export const createGroupChatApi = async (payload: CreateGroupChatPayload) => {
  const response = await api.post<{
    success: boolean;
    data: Chat;
  }>(API_ENDPOINTS.chats.group, payload);

  return response.data;
};

export const renameGroupApi = async (
  chatId: string,
  payload: RenameGroupPayload,
) => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    data: Chat;
  }>(API_ENDPOINTS.chats.renameGroup(chatId), payload);

  return response.data;
};

export const addGroupMembersApi = async (
  chatId: string,
  payload: AddGroupMembersPayload,
) => {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: any;
  }>(API_ENDPOINTS.chats.members(chatId), payload);

  return response.data;
};

export const removeGroupMemberApi = async (
  chatId: string,
  memberId: string,
) => {
  const response = await api.delete<{
    success: boolean;
    message: string;
    data: any;
  }>(API_ENDPOINTS.chats.removeMember(chatId, memberId));

  return response.data;
};

export const leaveGroupApi = async (chatId: string) => {
  const response = await api.post<{
    success: boolean;
    message: string;
  }>(API_ENDPOINTS.chats.leaveGroup(chatId));

  return response.data;
};

export const deleteGroupApi = async (chatId: string) => {
  const response = await api.delete<{
    success: boolean;
    message: string;
  }>(API_ENDPOINTS.chats.byId(chatId));

  return response.data;
};

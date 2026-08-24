import { User } from "./auth";

export type ChatType = "PRIVATE" | "GROUP";

export interface ChatMember {
  id: string;
  userId: string;
  chatId: string;
  isAdmin: boolean;
  joinedAt: string;
  user: User;
}

export interface LastMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  name?: string | null;
  createdBy?: string | null;
  type: ChatType;
  image?: string | null;
  createdAt: string;
  updatedAt: string;

  members: ChatMember[];
  lastMessage?: LastMessage | null;
  unreadCount?: number;
}

export interface CreatePrivateChatPayload {
  userId: string;
}

export interface CreateGroupChatPayload {
  name: string;
  members: string[];
  image?: string;
}

export interface UserSearchParams {
  search: string;
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  items: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedChats {
  items: Chat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RenameGroupPayload {
  name: string;
}

export interface AddGroupMembersPayload {
  members: string[];
}

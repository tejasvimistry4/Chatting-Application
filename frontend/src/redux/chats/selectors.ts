import { RootState } from "../store";

import { Chat, PaginatedChats } from "../../types/chat";

export const selectChats = (state: RootState): PaginatedChats =>
  state.chats.chats;

export const selectChatItems = (state: RootState): Chat[] =>
  state.chats.chats.items;

export const selectSelectedChatId = (state: RootState) =>
  state.chats.selectedChatId;

export const selectChatLoading = (state: RootState) => state.chats.loading;

export const selectChatError = (state: RootState) => state.chats.error;

export const selectSelectedChat = (state: RootState): Chat | null => {
  const id = state.chats.selectedChatId;

  if (!id) {
    return null;
  }

  return state.chats.chats.items.find((chat) => chat.id === id) || null;
};

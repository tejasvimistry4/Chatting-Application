import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Chat, PaginatedChats } from "../../types/chat";

interface ChatState {
  chats: PaginatedChats;
  selectedChatId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: {
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  selectedChatId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chats",

  initialState,

  reducers: {
    setChats: (state, action: PayloadAction<PaginatedChats>) => {
      state.chats = action.payload;
      state.loading = false;
      state.error = null;
    },

    addChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.items.findIndex(
        (chat) => chat.id === action.payload.id,
      );

      if (index === -1) {
        state.chats.items.unshift(action.payload);
        state.chats.total += 1;
        return;
      }

      state.chats.items[index] = {
        ...state.chats.items[index],
        ...action.payload,
      };
    },

    setSelectedChat: (state, action: PayloadAction<Chat>) => {
      const existingIndex = state.chats.items.findIndex(
        (chat) => chat.id === action.payload.id,
      );

      if (existingIndex === -1) {
        state.chats.items.unshift(action.payload);
        state.chats.total += 1;
      } else {
        state.chats.items[existingIndex] = action.payload;
      }

      state.selectedChatId = action.payload.id;
    },

    updateChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.items.findIndex(
        (chat) => chat.id === action.payload.id,
      );

      if (index === -1) {
        state.chats.items.unshift(action.payload);
        state.chats.total += 1;
        return;
      }

      state.chats.items[index] = {
        ...state.chats.items[index],
        ...action.payload,
      };
    },

    removeChat: (state, action: PayloadAction<string>) => {
      const exists = state.chats.items.some(
        (chat) => chat.id === action.payload,
      );

      if (!exists) {
        return;
      }

      state.chats.items = state.chats.items.filter(
        (chat) => chat.id !== action.payload,
      );

      state.chats.total = Math.max(0, state.chats.total - 1);

      if (state.selectedChatId === action.payload) {
        state.selectedChatId = null;
      }
    },

    selectChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },

    setChatsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setChatsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    incrementUnreadCount: (
      state,
      action: PayloadAction<{
        chatId: string;
        amount?: number;
      }>,
    ) => {
      const chat = state.chats.items.find(
        (item) => item.id === action.payload.chatId,
      );

      if (!chat) {
        return;
      }

      chat.unreadCount = (chat.unreadCount || 0) + (action.payload.amount || 1);
    },

    clearUnreadCount: (state, action: PayloadAction<string>) => {
      const chat = state.chats.items.find((item) => item.id === action.payload);

      if (chat) {
        chat.unreadCount = 0;
      }
    },

    updateLastMessage: (
      state,
      action: PayloadAction<{
        chatId: string;
        message: Chat["lastMessage"];
      }>,
    ) => {
      const { chatId, message } = action.payload;

      const index = state.chats.items.findIndex((chat) => chat.id === chatId);

      if (index === -1) {
        return;
      }

      const chat = state.chats.items[index];

      chat.lastMessage = message;

      if (message?.createdAt) {
        chat.updatedAt = message.createdAt;
      }

      if (index > 0) {
        state.chats.items.splice(index, 1);
        state.chats.items.unshift(chat);
      }
    },
  },
});

export const {
  setChats,
  addChat,
  setSelectedChat,
  updateChat,
  removeChat,
  selectChat,
  setChatsLoading,
  setChatsError,
  incrementUnreadCount,
  clearUnreadCount,
  updateLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;

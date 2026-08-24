import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Message } from "../../types/message";

interface MessagesState {
  byChatId: Record<string, Message[]>;
  loadingByChatId: Record<string, boolean>;
  errorByChatId: Record<string, string | null>;
}

const initialState: MessagesState = {
  byChatId: {},
  loadingByChatId: {},
  errorByChatId: {},
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{
        chatId: string;
        messages: Message[];
      }>,
    ) => {
      state.byChatId[action.payload.chatId] = action.payload.messages;
      state.loadingByChatId[action.payload.chatId] = false;
      state.errorByChatId[action.payload.chatId] = null;
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      const messages = state.byChatId[message.chatId] || [];

      const alreadyExists = messages.some((item) => item.id === message.id);

      if (alreadyExists) {
        return;
      }

      messages.push(message);

      state.byChatId[message.chatId] = messages;
    },

    prependMessages: (
      state,
      action: PayloadAction<{
        chatId: string;
        messages: Message[];
      }>,
    ) => {
      const existing = state.byChatId[action.payload.chatId] || [];

      const existingIds = new Set(existing.map((message) => message.id));

      const newMessages = action.payload.messages.filter(
        (message) => !existingIds.has(message.id),
      );

      state.byChatId[action.payload.chatId] = [...newMessages, ...existing];
    },

    updateMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      const messages = state.byChatId[message.chatId];

      if (!messages) {
        return;
      }

      const index = messages.findIndex((item) => item.id === message.id);

      if (index !== -1) {
        messages[index] = message;
      }
    },

    removeMessage: (
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
      }>,
    ) => {
      const messages = state.byChatId[action.payload.chatId];

      if (!messages) {
        return;
      }

      state.byChatId[action.payload.chatId] = messages.filter(
        (message) => message.id !== action.payload.messageId,
      );
    },

    setMessagesLoading: (
      state,
      action: PayloadAction<{
        chatId: string;
        loading: boolean;
      }>,
    ) => {
      state.loadingByChatId[action.payload.chatId] = action.payload.loading;
    },

    setMessagesError: (
      state,
      action: PayloadAction<{
        chatId: string;
        error: string | null;
      }>,
    ) => {
      state.errorByChatId[action.payload.chatId] = action.payload.error;
      state.loadingByChatId[action.payload.chatId] = false;
    },

    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.byChatId[action.payload];
      delete state.loadingByChatId[action.payload];
      delete state.errorByChatId[action.payload];
    },
  },
});

export const {
  setMessages,
  addMessage,
  prependMessages,
  updateMessage,
  removeMessage,
  setMessagesLoading,
  setMessagesError,
  clearMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;

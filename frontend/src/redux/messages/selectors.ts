import { RootState } from "../store";
import { Message } from "../../types/message";

const EMPTY_MESSAGES: Message[] = [];

export const selectMessagesByChatId = (
  state: RootState,
  chatId: string,
): Message[] => {
  return state.messages.byChatId[chatId] ?? EMPTY_MESSAGES;
};

export const selectMessagesLoading = (
  state: RootState,
  chatId: string,
): boolean => {
  return state.messages.loadingByChatId[chatId] ?? false;
};

export const selectMessagesError = (
  state: RootState,
  chatId: string,
): string | null => {
  return state.messages.errorByChatId[chatId] ?? null;
};

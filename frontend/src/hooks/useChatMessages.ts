import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getMessages } from "../services/message.service";

import {
  setMessages,
  setMessagesLoading,
  setMessagesError,
} from "../redux/messages/messagesSlice";

import {
  selectMessagesByChatId,
  selectMessagesLoading,
  selectMessagesError,
} from "../redux/messages/selectors";
import { Message } from "../types/message";

const EMPTY_MESSAGES: Message[] = [];

export const useChatMessages = (chatId?: string) => {
  const dispatch = useAppDispatch();

  const messages = useAppSelector((state) =>
    chatId ? selectMessagesByChatId(state, chatId) : EMPTY_MESSAGES,
  );

  const loading = useAppSelector((state) =>
    chatId ? selectMessagesLoading(state, chatId) : false,
  );

  const error = useAppSelector((state) =>
    chatId ? selectMessagesError(state, chatId) : null,
  );

  const loadMessages = useCallback(async () => {
    if (!chatId) {
      return;
    }

    try {
      dispatch(
        setMessagesLoading({
          chatId,
          loading: true,
        }),
      );

      const response = await getMessages(chatId, {
        page: 1,
        limit: 50,
      });

      const data = response.data;

      const messagesData = Array.isArray(data) ? data : (data?.items ?? []);

      const sortedMessages = [...messagesData].sort(
        (a: Message, b: Message) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        },
      );
      dispatch(
        setMessages({
          chatId,
          messages: sortedMessages,
        }),
      );
    } catch (error: any) {
      dispatch(
        setMessagesError({
          chatId,
          error: error?.response?.data?.message ?? "Unable to load messages.",
        }),
      );
    } finally {
      dispatch(
        setMessagesLoading({
          chatId,
          loading: false,
        }),
      );
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    loadMessages();
  }, [chatId, loadMessages]);

  return {
    messages,
    loading,
    error,
    reload: loadMessages,
  };
};

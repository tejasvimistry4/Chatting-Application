import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../redux/store";

import { selectSelectedChatId } from "../redux/chats/selectors";

import { addMessage } from "../redux/messages/messagesSlice";

import {
  addChat,
  updateChat,
  removeChat,
  updateLastMessage,
  incrementUnreadCount,
} from "../redux/chats/chatSlice";

import { SOCKET_EVENTS } from "../socket/events";

import { useSocketContext } from "../context/SocketContext";

export const useSocket = () => {
  const dispatch = useAppDispatch();

  const { socket, connected } = useSocketContext();

  const selectedChatId = useAppSelector(selectSelectedChatId);

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleReceiveMessage = (message: any) => {
      if (!message?.chatId) {
        return;
      }

      dispatch(addMessage(message));

      dispatch(
        updateLastMessage({
          chatId: message.chatId,
          message: {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            createdAt: message.createdAt,
          },
        }),
      );

      if (message.chatId !== selectedChatId) {
        dispatch(
          incrementUnreadCount({
            chatId: message.chatId,
          }),
        );
      }
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [socket, connected, selectedChatId, dispatch]);

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleChatCreated = (chat: any) => {
      if (!chat?.id) {
        return;
      }

      dispatch(addChat(chat));
    };

    socket.on(SOCKET_EVENTS.CHAT_CREATED, handleChatCreated);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_CREATED, handleChatCreated);
    };
  }, [socket, connected, dispatch]);

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleGroupUpdated = (chat: any) => {
      if (!chat?.id) {
        return;
      }

      dispatch(updateChat(chat));
    };

    socket.on(SOCKET_EVENTS.GROUP_UPDATED, handleGroupUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.GROUP_UPDATED, handleGroupUpdated);
    };
  }, [socket, connected, dispatch]);

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleMemberAdded = (payload: any) => {
      if (!payload?.chat?.id) {
        return;
      }

      dispatch(updateChat(payload.chat));
    };

    socket.on(SOCKET_EVENTS.GROUP_MEMBER_ADDED, handleMemberAdded);

    return () => {
      socket.off(SOCKET_EVENTS.GROUP_MEMBER_ADDED, handleMemberAdded);
    };
  }, [socket, connected, dispatch]);

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleMemberRemoved = (payload: any) => {
      if (!payload?.chat) {
        dispatch(removeChat(payload.chatId));

        return;
      }

      dispatch(updateChat(payload.chat));
    };

    socket.on(SOCKET_EVENTS.GROUP_MEMBER_REMOVED, handleMemberRemoved);

    return () => {
      socket.off(SOCKET_EVENTS.GROUP_MEMBER_REMOVED, handleMemberRemoved);
    };
  }, [socket, connected, dispatch]);

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleMemberLeft = (payload: any) => {
      if (!payload?.chat) {
        dispatch(removeChat(payload.chatId));

        return;
      }
      dispatch(updateChat(payload.chat));
    };

    socket.on(SOCKET_EVENTS.GROUP_MEMBER_LEFT, handleMemberLeft);

    return () => {
      socket.off(SOCKET_EVENTS.GROUP_MEMBER_LEFT, handleMemberLeft);
    };
  }, [socket, connected, dispatch]);

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleGroupDeleted = (payload: any) => {
      if (!payload?.chatId) {
        return;
      }

      dispatch(removeChat(payload.chatId));
    };

    socket.on(SOCKET_EVENTS.GROUP_DELETED, handleGroupDeleted);

    return () => {
      socket.off(SOCKET_EVENTS.GROUP_DELETED, handleGroupDeleted);
    };
  }, [socket, connected, dispatch]);

  return socket;
};

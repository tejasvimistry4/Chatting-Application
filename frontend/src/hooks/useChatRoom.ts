import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { SOCKET_EVENTS } from "../socket/events";

export const useChatRoom = (chatId?: string) => {
  const { socket, connected } = useSocketContext();

  useEffect(() => {
    if (!socket || !connected || !chatId) {
      return;
    }

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, chatId);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, chatId);
    };
  }, [socket, connected, chatId]);
};

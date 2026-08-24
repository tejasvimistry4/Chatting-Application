import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";

import { SOCKET_EVENTS } from "../socket/events";

export const useChatRoom = (chatId?: string) => {
  const { socket, connected } = useSocketContext();

  useEffect(() => {
    if (!socket || !connected || !chatId) {
      return;
    }

    socket.emit(
      SOCKET_EVENTS.JOIN_ROOM,
      chatId,
      (response: { success: boolean; chatId?: string; message?: string }) => {
        if (response?.success) {
        } else {
          console.error("❌ Failed to join chat room:", response?.message);
        }
      },
    );

    return () => {
      socket.emit(
        SOCKET_EVENTS.LEAVE_ROOM,
        chatId,
        (response: { success: boolean; message?: string }) => {
          if (!response?.success) {
            console.error("❌ Failed to leave chat:", response?.message);
          }
        },
      );
    };
  }, [socket, connected, chatId]);
};

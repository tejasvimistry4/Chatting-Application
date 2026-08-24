import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { createSocket, disconnectSocket } from "../socket/socket";
import { useAppSelector } from "../redux/store";
import { SOCKET_EVENTS } from "../socket/events";

interface TypingUser {
  userId: string;
  userName: string;
}

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  typingUsers: Record<string, TypingUser[]>;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  typingUsers: {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, accessToken, loading } = useAppSelector((state) => state.auth);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingUser[]>>(
    {},
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user || !accessToken) {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
      setTypingUsers({});

      return;
    }

    const newSocket = createSocket(accessToken);

    const handleConnect = () => {
      console.log("✅ Socket connected:", newSocket.id);

      setConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected:", reason);

      setConnected(false);
      setTypingUsers({});
    };

    const handleConnectError = (error: Error) => {
      console.error("❌ Socket connection error:", error.message);

      setConnected(false);
    };

    const handleTyping = (data: {
      chatId: string;
      userId: string;
      userName: string;
    }) => {
      if (!data?.chatId || !data?.userId) {
        return;
      }

      if (data.userId === user.id) {
        return;
      }

      setTypingUsers((previous) => {
        const current = previous[data.chatId] || [];

        const alreadyTyping = current.some(
          (typingUser) => typingUser.userId === data.userId,
        );

        if (alreadyTyping) {
          return previous;
        }

        return {
          ...previous,
          [data.chatId]: [
            ...current,
            {
              userId: data.userId,
              userName: data.userName,
            },
          ],
        };
      });
    };

    const handleStopTyping = (data: { chatId: string; userId: string }) => {
      if (!data?.chatId || !data?.userId) {
        return;
      }

      setTypingUsers((previous) => {
        const current = previous[data.chatId] || [];

        const updated = current.filter(
          (typingUser) => typingUser.userId !== data.userId,
        );

        if (updated.length === 0) {
          const copy = {
            ...previous,
          };
          delete copy[data.chatId];
          return copy;
        }

        return {
          ...previous,
          [data.chatId]: updated,
        };
      });
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("connect_error", handleConnectError);
    newSocket.on(SOCKET_EVENTS.TYPING, handleTyping);
    newSocket.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
    setSocket(newSocket);
    newSocket.connect();

    return () => {
      console.log("Cleaning socket");
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("connect_error", handleConnectError);
      newSocket.off(SOCKET_EVENTS.TYPING, handleTyping);
      newSocket.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);

      newSocket.disconnect();
      disconnectSocket();
      setSocket(null);
      setConnected(false);
      setTypingUsers({});
    };
  }, [user, accessToken, loading]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        typingUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);

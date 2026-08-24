import { io, Socket } from "socket.io-client";
import { ENV } from "../config/env";

let socket: Socket | null = null;

export const createSocket = (accessToken: string) => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(ENV.SOCKET_URL, {
    autoConnect: false,

    auth: {
      token: accessToken,
    },

    transports: ["websocket", "polling"],
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

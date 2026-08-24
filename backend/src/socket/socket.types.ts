import { Socket } from "socket.io";

export interface AuthSocket extends Socket {
  data: Socket["data"] & {
    userId: string;
  };
}

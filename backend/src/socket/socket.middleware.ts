import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new Error("Authentication required"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    socket.data.userId = decoded.id;

    next();
  } catch {
    next(new Error("Invalid token"));
  }
};

import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socket.middleware";
import { addOnlineUser, removeOnlineUser, getOnlineUsers } from "./onlineUsers";
import { AuthSocket } from "./socket.types";
import messageService from "../modules/messages/message.service";
import chatService from "../modules/chats/chat.service";

let ioInstance: Server | null = null;

export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return ioInstance;
};

export const initializeSocket = (io: Server) => {
  ioInstance = io;

  io.use(socketAuthMiddleware);

  io.on("connection", (socket: AuthSocket) => {
    const userId = socket.data.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }

    addOnlineUser(userId, socket.id);

    socket.join(`user:${userId}`);

    socket.emit("online-users", getOnlineUsers());

    socket.broadcast.emit("user-online", {
      userId,
    });

    socket.on("join-room", async (chatId: string, callback) => {
      try {
        const userId = socket.data.userId;

        await chatService.assertMember(chatId, userId);

        socket.join(`chat:${chatId}`);

        callback?.({
          success: true,
          chatId,
        });
      } catch (error) {
        callback?.({
          success: false,
          message:
            error instanceof Error ? error.message : "Unable to join chat.",
        });
      }
    });

    socket.on("leave-room", async (chatId: string, callback) => {
      try {
        await chatService.assertMember(chatId, socket.data.userId);

        socket.leave(`chat:${chatId}`);

        callback?.({
          success: true,
        });
      } catch (error) {
        callback?.({
          success: false,
          message:
            error instanceof Error ? error.message : "Unable to leave chat.",
        });
      }
    });

    socket.on("send-message", async (payload, callback) => {
      try {
        const message = await messageService.sendMessage(socket.data.userId, {
          chatId: payload.chatId,
          content: payload.content,
          type: payload.type ?? "TEXT",
          fileUrl: payload.fileUrl,
          fileName: payload.fileName,
          fileSize: payload.fileSize,
        });

        io.to(`chat:${payload.chatId}`).emit("receive-message", message);

        callback?.({
          success: true,
          message,
        });
      } catch (error) {
        callback?.({
          success: false,
          message:
            error instanceof Error ? error.message : "Unable to send message.",
        });
      }
    });

    socket.on("typing", async ({ chatId }) => {
      try {
        await chatService.assertMember(chatId, socket.data.userId);

        socket.to(`chat:${chatId}`).emit("user-typing", {
          chatId,
          userId: socket.data.userId,
        });
      } catch {}
    });

    socket.on("stop-typing", async ({ chatId }) => {
      try {
        await chatService.assertMember(chatId, socket.data.userId);

        socket.to(`chat:${chatId}`).emit("user-stop-typing", {
          chatId,
          userId: socket.data.userId,
        });
      } catch {}
    });

    socket.on("message-read", async ({ chatId, messageId }, callback) => {
      try {
        await chatService.assertMember(chatId, socket.data.userId);

        const read = await messageService.readMessage(
          socket.data.userId,
          messageId,
        );

        io.to(`chat:${chatId}`).emit("message-read", {
          chatId,
          messageId,
          userId: socket.data.userId,
          readAt: read.readAt,
        });

        callback?.({
          success: true,
        });
      } catch (error) {
        callback?.({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Unable to mark message as read.",
        });
      }
    });

    socket.on("disconnect", () => {
      const wentOffline = removeOnlineUser(userId, socket.id);

      if (wentOffline) {
        socket.broadcast.emit("user-offline", {
          userId,
        });
      }
    });
  });

  return io;
};

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import chatRoutes from "./modules/chats/chat.routes";
import groupRoutes from "./modules/groups/groupChat.routes";
import uploadRoutes from "./modules/uploads/upload.routes";
import messageRoutes from "./modules/messages/message.routes";

import { errorHandler } from "./middleware/error.middleware";

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Chat API Running",
  });
});

app.use(
  "/uploads",
  express.static(path.resolve(process.env.UPLOAD_DIR || "./uploads")),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chats", groupRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/chats", messageRoutes);

app.use(errorHandler);
export default app;

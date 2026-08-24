import http from "http";
import app from "./app";
import { Server } from "socket.io";
import { logger } from "./config/logger";
import { initializeSocket } from "./socket";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initializeSocket(io);

server.listen(PORT, () => {
  logger.info(`Server running on ${PORT}`);
});

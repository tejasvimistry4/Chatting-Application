const { io } = require("socket.io-client");
const readline = require("readline");

const CHAT_ID = "d00be2e6-64ab-420a-95d0-421b83eb4ed2";

const socket = io("http://localhost:5000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExYjY0MjIyLTYyNDYtNDJjNC1hZjYxLTljZjNiYmYyZGZhMiIsImlhdCI6MTc4NjA4NDIyMCwiZXhwIjoxNzg2Njg5MDIwfQ.flj6yYz9qbrCm8GOMJkfISYsaEgg4dx5qJ0BwLpuX_4",
  },
});

socket.on("connect", () => {
  socket.emit("join-room", CHAT_ID);
});

socket.on("receive-message", (message) => {});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  socket.emit(
    "send-message",
    {
      chatId: CHAT_ID,
      content: input,
    },
    (response) => {},
  );
});

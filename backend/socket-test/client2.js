const { io } = require("socket.io-client");
const readline = require("readline");

const CHAT_ID = "d00be2e6-64ab-420a-95d0-421b83eb4ed2";

const socket = io("http://localhost:5000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIwNzAyN2NiLTZkNTYtNDk5NS04Mzk5LWFmODg0ZDllYWYxMyIsImlhdCI6MTc4NjEwMzA1OCwiZXhwIjoxNzg2NzA3ODU4fQ.3dj8VrPaayvdLkqo2VCtjLmaHbauGVAZ1r1rnFTmQWU",
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

rl.on("line", (content) => {
  socket.emit(
    "send-message",
    {
      chatId: CHAT_ID,
      content,
    },
    (response) => {},
  );
});

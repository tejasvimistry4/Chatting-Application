export const SOCKET_EVENTS = {
  CONNECTION: "connect",
  DISCONNECT: "disconnect",

  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",

  SEND_MESSAGE: "send-message",
  RECEIVE_MESSAGE: "receive-message",

  TYPING: "typing",
  STOP_TYPING: "stop-typing",

  USER_TYPING: "user-typing",
  USER_STOP_TYPING: "user-stop-typing",

  MESSAGE_READ: "message-read",
  CHAT_CREATED: "chat-created",

  GROUP_UPDATED: "group-updated",
  GROUP_MEMBER_ADDED: "group-member-added",
  GROUP_MEMBER_REMOVED: "group-member-removed",
  GROUP_MEMBER_LEFT: "group-member-left",
  GROUP_DELETED: "group-deleted",

  ONLINE_USERS: "online-users",

  USER_ONLINE: "user-online",
  USER_OFFLINE: "user-offline",

  NOTIFICATION: "notification",
} as const;

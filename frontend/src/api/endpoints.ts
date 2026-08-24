export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile",
    logout: "/auth/logout",
  },

  users: {
    list: "/users",
    search: "/users/search",
  },

  chats: {
    list: "/chats",
    private: "/chats/private",
    group: "/chats/group",
    byId: (chatId: string) => `/chats/${chatId}`,
    renameGroup: (chatId: string) => `/chats/${chatId}`,
    members: (chatId: string) => `/chats/${chatId}/members`,
    removeMember: (chatId: string, memberId: string) =>
      `/chats/${chatId}/members/${memberId}`,

    leaveGroup: (chatId: string) => `/chats/${chatId}/leave`,
  },

  messages: {
    list: (chatId: string) => `/chats/${chatId}/messages`,
  },

  notifications: {
    list: "/notifications",
  },

  uploads: {
    uploads: "/uploads",
    create: "/uploads",
  },
};

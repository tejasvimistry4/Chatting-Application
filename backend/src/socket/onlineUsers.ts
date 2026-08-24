const onlineUsers = new Map<string, Set<string>>();

export const addOnlineUser = (userId: string, socketId: string) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }

  onlineUsers.get(userId)!.add(socketId);
};

export const removeOnlineUser = (userId: string, socketId: string): boolean => {
  const sockets = onlineUsers.get(userId);

  if (!sockets) {
    return false;
  }

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    return true;
  }

  return false;
};

export const getOnlineUsers = (): string[] => {
  return [...onlineUsers.keys()];
};

export const getUserSockets = (userId: string): Set<string> | undefined => {
  return onlineUsers.get(userId);
};

export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};

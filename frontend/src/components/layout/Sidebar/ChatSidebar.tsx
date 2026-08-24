import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import Avatar from "../../common/Avatar/Avatar";

import { Chat, PaginatedChats } from "../../../types/chat";

interface Props {
  chats: PaginatedChats;
  selectedChatId: string | null;
  currentUserId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

const getChatName = (chat: Chat, currentUserId?: string) => {
  if (chat.type === "GROUP") {
    return chat.name || "Unnamed group";
  }
  const otherMember = chat.members.find(
    (member) => member.userId !== currentUserId,
  );

  return otherMember?.user.fullName || "Private chat";
};

const getChatAvatar = (chat: Chat, currentUserId: string) => {
  if (chat.type === "GROUP") {
    return chat.image;
  }
  const otherMember = chat.members.find(
    (member) => member.userId !== currentUserId,
  );

  return otherMember?.user.avatar;
};

const ChatSidebar = ({
  chats,
  selectedChatId,
  currentUserId,
  onSelectChat,
  onNewChat,
}: Props) => {
  const [search, setSearch] = useState("");

  const filteredChats = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) {
      return chats.items;
    }

    return chats.items.filter((chat) => {
      const chatName = getChatName(chat, currentUserId);

      const lastMessage = chat.lastMessage?.content || "";

      return (
        chatName.toLowerCase().includes(value) ||
        lastMessage.toLowerCase().includes(value)
      );
    });
  }, [chats.items, search, currentUserId]);

  return (
    <aside className="flex min-h-0 h-full w-80 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <p className="text-xs text-gray-500">Your conversations</p>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="rounded-xl bg-blue-600 p-2.5 text-white shadow-sm transition hover:bg-blue-700"
          title="New chat"
        >
          <Plus size={19} />
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl bg-gray-100 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        {filteredChats.length === 0 && (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              {search ? "No conversations found" : "No conversations yet"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {search ? "Try a different search" : "Click + to start chatting"}
            </p>
          </div>
        )}

        {filteredChats.map((chat) => {
          const chatName = getChatName(chat, currentUserId);

          const chatAvatar = getChatAvatar(chat, currentUserId);

          const selected = chat.id === selectedChatId;

          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => onSelectChat(chat.id)}
              className={`
                  flex w-full items-center gap-3
                  rounded-xl px-3 py-3
                  text-left transition
                  ${selected ? "bg-blue-50" : "hover:bg-gray-50"}
                `}
            >
              <Avatar name={chatName} src={chat.image} size="md" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`
                        truncate text-sm
                        ${
                          selected
                            ? "font-semibold text-blue-700"
                            : "font-medium text-gray-900"
                        }
                      `}
                  >
                    {chatName}
                  </p>

                  {chat.lastMessage && (
                    <span className="shrink-0 text-[10px] text-gray-400">
                      {new Date(chat.lastMessage.createdAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-gray-500">
                    {chat.lastMessage?.content || "No messages yet"}
                  </p>

                  {!!chat.unreadCount && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                      {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ChatSidebar;

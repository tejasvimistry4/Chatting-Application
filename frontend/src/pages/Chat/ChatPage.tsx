import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MoreVertical } from "lucide-react";

import Avatar from "../../components/common/Avatar/Avatar";
import MessageList from "../../features/messages/MessageList";
import MessageComposer from "../../features/messages/MessageComposer";
import GroupSettingsModal from "../../features/chats/GroupSettingsModal";

import { useChatMessages } from "../../hooks/useChatMessages";
import { useChatRoom } from "../../hooks/useChatRoom";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { selectSelectedChat } from "../../redux/chats/selectors";
import { removeChat, setSelectedChat } from "../../redux/chats/chatSlice";
import { getChat } from "../../services/chat.service";

const ChatPage = () => {
  const { chatId } = useParams<{
    chatId: string;
  }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const chat = useAppSelector(selectSelectedChat);
  const { messages, loading } = useChatMessages(chatId);

  useChatRoom(chatId);

  const [groupSettingsOpen, setGroupSettingsOpen] = useState(false);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const loadChat = async () => {
      try {
        const response = await getChat(chatId);
        dispatch(setSelectedChat(response.data.chat));
      } catch (error) {
        console.error("Failed to load chat:", error);
      }
    };

    loadChat();
  }, [chatId, dispatch]);

  const members = chat?.members ?? [];

  const otherMember = members.find((member) => member.userId !== user?.id);

  const chatName =
    chat?.type === "GROUP"
      ? chat.name || "Group"
      : otherMember?.user?.fullName || "Conversation";

  const chatAvatar =
    chat?.type === "GROUP" ? chat.image : otherMember?.user?.avatar;

  const handleChatUpdated = async () => {
    if (!chatId) {
      return;
    }

    try {
      const response = await getChat(chatId);
      dispatch(setSelectedChat(response.data.chat));
    } catch (error) {
      console.error("Failed to refresh group:", error);
    }
  };

  const handleGroupRemoved = () => {
    if (!chatId) {
      return;
    }

    dispatch(removeChat(chatId));
    setGroupSettingsOpen(false);
    navigate("/");
  };

  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 px-5">
        <Avatar name={chatName} src={chatAvatar} size="md" />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-gray-900">
            {chatName}
          </h1>

          <p className="text-xs text-gray-500">
            {chat.type === "GROUP"
              ? `${chat.members.length} members`
              : "Private conversation"}
          </p>
        </div>

        {chat.type === "GROUP" && (
          <button
            type="button"
            onClick={() => setGroupSettingsOpen(true)}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            title="Group settings"
          >
            <MoreVertical size={20} />
          </button>
        )}
      </header>

      <MessageList
        messages={messages}
        loading={loading}
        currentUserId={user?.id || ""}
      />
      <MessageComposer chatId={chatId} />

      {chat.type === "GROUP" && (
        <GroupSettingsModal
          open={groupSettingsOpen}
          chat={chat}
          currentUserId={user?.id || ""}
          onClose={() => setGroupSettingsOpen(false)}
          onChatUpdated={handleChatUpdated}
          onGroupRemoved={handleGroupRemoved}
        />
      )}
    </div>
  );
};

export default ChatPage;

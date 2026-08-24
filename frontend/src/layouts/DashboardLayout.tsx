import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ChatSidebar from "../components/layout/Sidebar/ChatSidebar";
import Header from "../components/layout/Header/Header";
import NewChatModal from "../features/chats/NewChatModal";
import { selectChats, selectSelectedChatId } from "../redux/chats/selectors";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  addChat,
  selectChat,
  setChats,
  setChatsError,
  setChatsLoading,
} from "../redux/chats/chatSlice";
import { getChats } from "../services/chat.service";
import { showErrorToast } from "../utils/toast";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { chatId } = useParams();
  const chats = useAppSelector(selectChats);
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const [newChatOpen, setNewChatOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadChats = async () => {
      try {
        dispatch(setChatsLoading(true));
        dispatch(setChatsError(null));

        const firstResponse = await getChats(1, 20);

        if (cancelled) {
          return;
        }

        const firstPage = firstResponse.data;

        let allItems = [...firstPage.items];

        if (firstPage.totalPages > 1) {
          const remainingResponses = await Promise.all(
            Array.from(
              {
                length: firstPage.totalPages - 1,
              },
              (_, index) => getChats(index + 2, 20),
            ),
          );

          if (cancelled) {
            return;
          }

          remainingResponses.forEach((response) => {
            allItems.push(...response.data.items);
          });
        }

        const normalizedItems = allItems.map((chat: any) => ({
          ...chat,

          avatar: chat.image ?? null,

          lastMessage: chat.messages?.[0]
            ? {
                id: chat.messages[0].id,
                content: chat.messages[0].content,
                senderId: chat.messages[0].senderId,
                createdAt: chat.messages[0].createdAt,
              }
            : (chat.lastMessage ?? null),
        }));

        const normalizedChats = {
          ...firstPage,
          items: normalizedItems,
          total: normalizedItems.length,
          page: 1,
          limit: normalizedItems.length,
          totalPages: 1,
        };

        dispatch(setChats(normalizedChats));
      } catch (error: any) {
        if (cancelled) {
          return;
        }

        const message =
          error?.response?.data?.message || "Unable to load chats.";
        dispatch(setChatsError(message));
        showErrorToast(message);
      } finally {
        if (!cancelled) {
          dispatch(setChatsLoading(false));
        }
      }
    };

    loadChats();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const handleSelectChat = (id: string) => {
    dispatch(selectChat(id));
    navigate(`/chat/${id}`);
  };

  const handleChatCreated = (chat: any) => {
    dispatch(addChat(chat));
    dispatch(selectChat(chat.id));
    navigate(`/chat/${chat.id}`);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <Header />

      <div className="flex min-h-0 flex-1">
        <ChatSidebar
          chats={chats}
          selectedChatId={chatId || selectedChatId}
          currentUserId={user?.id || ""}
          onSelectChat={handleSelectChat}
          onNewChat={() => setNewChatOpen(true)}
        />

        <main className="min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      <NewChatModal
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
};

export default DashboardLayout;

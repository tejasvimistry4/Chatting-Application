import { FormEvent, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useSocketContext } from "../../context/SocketContext";
import { SOCKET_EVENTS } from "../../socket/events";

interface Props {
  chatId?: string;
}

interface SendMessageResponse {
  success: boolean;
  message?: any;
}

const TYPING_DELAY = 500;

const MessageComposer = ({ chatId }: Props) => {
  const { socket, connected } = useSocketContext();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTypingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (isTypingRef.current && socket && chatId) {
        socket.emit(SOCKET_EVENTS.STOP_TYPING, {
          chatId,
        });
      }

      isTypingRef.current = false;
    };
  }, [chatId, socket]);

  const handleTyping = () => {
    if (!socket || !connected || !socket.connected || !chatId) {
      return;
    }

    if (!isTypingRef.current) {
      socket.emit(SOCKET_EVENTS.TYPING, {
        chatId,
      });

      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (!socket || !chatId) {
        return;
      }

      socket.emit(SOCKET_EVENTS.STOP_TYPING, {
        chatId,
      });

      isTypingRef.current = false;
    }, TYPING_DELAY);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const text = content.trim();
    if (
      !text ||
      !chatId ||
      !socket ||
      !connected ||
      !socket.connected ||
      sending
    ) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit(SOCKET_EVENTS.STOP_TYPING, {
      chatId,
    });

    isTypingRef.current = false;

    setSending(true);

    socket.emit(
      SOCKET_EVENTS.SEND_MESSAGE,
      {
        chatId,
        content: text,
        type: "TEXT",
      },
      (response: SendMessageResponse) => {
        setSending(false);

        if (!response?.success) {
          return;
        }
        setContent("");
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4"
    >
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);

            handleTyping();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              event.currentTarget.form?.requestSubmit();

              return;
            }

            handleTyping();
          }}
          placeholder="Type a message..."
          rows={1}
          disabled={!connected}
          className="min-h-[46px] flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <button
          type="submit"
          disabled={
            sending ||
            !content.trim() ||
            !chatId ||
            !connected ||
            !socket?.connected
          }
          className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {sending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageComposer;

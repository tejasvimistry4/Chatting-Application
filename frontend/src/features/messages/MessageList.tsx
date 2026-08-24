import { useEffect, useRef } from "react";
import { Message } from "../../types/message";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
}

const MessageList = ({ messages, currentUserId, loading = false }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-3 text-3xl">👋</div>
          <p className="text-sm font-medium text-gray-700">No messages yet</p>
          <p className="mt-1 text-xs text-gray-500">Send the first message.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5">
      <div className="mx-auto flex max-w-4xl flex-col gap-3">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUserId={currentUserId}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageList;

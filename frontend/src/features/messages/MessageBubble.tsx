import { Message } from "../../types/message";

interface Props {
  message: Message;
  currentUserId: string;
}

const MessageBubble = ({ message, currentUserId }: Props) => {
  const isMine = message.senderId === currentUserId;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[75%]
          rounded-2xl
          px-4 py-2.5
          ${
            isMine
              ? "rounded-br-md bg-blue-600 text-white"
              : "rounded-bl-md bg-gray-100 text-gray-900"
          }
        `}
      >
        {!isMine && message.sender && (
          <p className="mb-1 text-xs font-semibold text-blue-600">
            {message.sender.fullName}
          </p>
        )}

        {message.isDeleted ? (
          <p className="text-sm italic opacity-60">This message was deleted</p>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        )}

        <div
          className={`
            mt-1 text-[10px]
            ${isMine ? "text-blue-100" : "text-gray-400"}
          `}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}

          {message.isEdited && " · edited"}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

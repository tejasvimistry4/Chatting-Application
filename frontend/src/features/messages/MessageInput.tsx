import { FormEvent, useState } from "react";

interface Props {
  onSend: (content: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

const MessageInput = ({ onSend, onTyping, onStopTyping }: Props) => {
  const [content, setContent] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const value = content.trim();

    if (!value) {
      return;
    }

    onSend(value);
    setContent("");
    onStopTyping?.();
  };

  const handleChange = (value: string) => {
    setContent(value);

    if (value.trim()) {
      onTyping?.();
    } else {
      onStopTyping?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t border-gray-200 bg-white p-4"
    >
      <input
        value={content}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <button
        type="submit"
        className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        disabled={!content.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;

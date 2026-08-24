export interface MessageSender {
  id: string;
  fullName: string;
  email?: string;
  avatar?: string | null;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;

  sender?: MessageSender;

  type?: "TEXT" | "IMAGE" | "FILE";
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;

  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface MessagesResponse {
  items: Message[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

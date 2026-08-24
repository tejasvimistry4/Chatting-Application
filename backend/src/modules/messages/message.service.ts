import repository from "./message.repository";

import { ApiError } from "../../utils/ApiError";
import { STATUS } from "../../constants/statusCodes";

interface SendMessageInput {
  chatId: string;
  content?: string;
  type: "TEXT" | "IMAGE" | "FILE";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

class MessageService {
  async sendMessage(senderId: string, input: SendMessageInput) {
    const { chatId, content, type, fileUrl, fileName, fileSize } = input;

    const membership = await repository.isMember(chatId, senderId);
    if (!membership) {
      throw new ApiError(
        STATUS.FORBIDDEN,
        "You are not a member of this chat.",
      );
    }

    if (type === "TEXT") {
      if (!content?.trim()) {
        throw new ApiError(STATUS.BAD_REQUEST, "Text message cannot be empty.");
      }

      if (fileUrl) {
        throw new ApiError(
          STATUS.BAD_REQUEST,
          "Text messages cannot contain files.",
        );
      }
    }

    if (type === "IMAGE" || type === "FILE") {
      if (!fileUrl) {
        throw new ApiError(STATUS.BAD_REQUEST, "File URL is required.");
      }

      if (!fileName) {
        throw new ApiError(STATUS.BAD_REQUEST, "File name is required.");
      }

      if (!fileSize) {
        throw new ApiError(STATUS.BAD_REQUEST, "File size is required.");
      }
    }

    return repository.createMessage({
      chatId,
      senderId,
      content: content?.trim(),
      type,
      fileUrl,
      fileName,
      fileSize,
    });
  }

  async readMessage(userId: string, messageId: string) {
    const message = await repository.findMessage(messageId);
    if (!message) {
      throw new ApiError(STATUS.NOT_FOUND, "Message not found.");
    }

    const member = await repository.isMember(message.chatId, userId);
    if (!member) {
      throw new ApiError(STATUS.FORBIDDEN, "You cannot read this message.");
    }

    return repository.markAsRead(messageId, userId);
  }

  async getMessages(
    userId: string,
    chatId: string,
    cursor?: string,
    limit = 30,
  ) {
    const member = await repository.isMember(chatId, userId);

    if (!member) {
      throw new ApiError(
        STATUS.FORBIDDEN,
        "You are not a member of this chat.",
      );
    }

    if (limit < 1 || limit > 100) {
      throw new ApiError(
        STATUS.BAD_REQUEST,
        "Limit must be between 1 and 100.",
      );
    }

    return repository.getMessages(chatId, cursor, limit);
  }
}

export default new MessageService();

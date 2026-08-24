import { Response } from "express";
import chatService from "./chat.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthRequest } from "../../middleware/auth.middleware";
import { MESSAGE } from "../../constants/messages";
import { STATUS } from "../../constants/statusCodes";

class ChatController {
  async createPrivateChat(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.body;

      const chat = await chatService.createPrivateChat(req.userId!, userId);

      return res
        .status(STATUS.CREATED)
        .json(new ApiResponse(true, MESSAGE.PRIVATE_CHAT_CREATED, chat));
    } catch (error) {
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            error instanceof Error ? error.message : "Internal Server Error",
          ),
        );
    }
  }

  async getChats(req: AuthRequest, res: Response) {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const search = String(req.query.search || "");

      const chats = await chatService.getChats(
        req.userId!,
        page,
        limit,
        search,
      );

      return res
        .status(STATUS.OK)
        .json(new ApiResponse(true, MESSAGE.CHATS_FETCHED, chats));
    } catch (error) {
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            error instanceof Error ? error.message : "Internal Server Error",
          ),
        );
    }
  }

  async getChatById(req: AuthRequest, res: Response) {
    try {
      const { chatId } = req.params;
      const page = Number(req.query.page || 1);

      const limit = Number(req.query.limit || 30);

      const chat = await chatService.getChatById(
        req.userId!,
        String(chatId),
        page,
        limit,
      );
      return res
        .status(STATUS.OK)
        .json(new ApiResponse(true, MESSAGE.CHAT_FETCHED, chat));
    } catch (error) {
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            false,
            error instanceof Error ? error.message : "Internal Server Error",
          ),
        );
    }
  }
}

export default new ChatController();

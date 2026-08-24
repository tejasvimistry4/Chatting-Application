import { Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthRequest } from "../../middleware/auth.middleware";
import groupChatService from "../groups/groupChat.service";
import { MESSAGE } from "../../constants/messages";
import { STATUS } from "../../constants/statusCodes";

class GroupChatController {
  async createGroupChat(req: AuthRequest, res: Response) {
    try {
      const { name, members } = req.body;

      const chat = await groupChatService.createGroupChat(
        req.userId!,
        name,
        members,
      );
      return res
        .status(STATUS.CREATED)
        .json(new ApiResponse(true, MESSAGE.GROUP_CREATED, chat));
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

  async renameGroup(req: AuthRequest, res: Response) {
    try {
      const { chatId } = req.params;
      const { name } = req.body;

      const chat = await groupChatService.renameGroup(
        req.userId!,
        String(chatId),
        name,
      );
      return res
        .status(STATUS.OK)
        .json(new ApiResponse(true, MESSAGE.GROUP_RENAMED, chat));
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

  async addMembers(req: AuthRequest, res: Response) {
    try {
      const { chatId } = req.params;
      const { members } = req.body;

      const result = await groupChatService.addMembers(
        req.userId!,
        String(chatId),
        members,
      );
      return res
        .status(STATUS.OK)
        .json(new ApiResponse(true, MESSAGE.MEMBER_ADDED, result));
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

  async removeMember(req: AuthRequest, res: Response) {
    try {
      const { chatId, memberId } = req.params;

      const result = await groupChatService.removeMember(
        req.userId!,
        String(chatId),
        String(memberId),
      );
      return res
        .status(STATUS.OK)
        .json(new ApiResponse(true, MESSAGE.MEMBER_REMOVED, result));
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

  async leaveGroup(req: AuthRequest, res: Response) {
    try {
      const { chatId } = req.params;

      await groupChatService.leaveGroup(req.userId!, String(chatId));

      return res
        .status(STATUS.OK)
        .json(new ApiResponse(true, MESSAGE.LEFT_GROUP));
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

  async deleteGroup(req: AuthRequest, res: Response) {
    try {
      const { chatId } = req.params;

      await groupChatService.deleteGroup(req.userId!, String(chatId));

      return res
        .status(STATUS.OK)
        .json(new ApiResponse(true, MESSAGE.GROUP_DELETED));
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
export default new GroupChatController();

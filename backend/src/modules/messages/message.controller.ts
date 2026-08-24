import { Response } from "express";

import messageService from "./message.service";

import { AuthRequest } from "../../middleware/auth.middleware";
import { ApiResponse } from "../../utils/ApiResponse";
import { STATUS } from "../../constants/statusCodes";

const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;

    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 30;

    const result = await messageService.getMessages(
      req.userId!,
      String(chatId),
      cursor,
      limit,
    );

    return res
      .status(STATUS.OK)
      .json(new ApiResponse(true, "Messages retrieved successfully.", result));
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
};

export default {
  getMessages,
};

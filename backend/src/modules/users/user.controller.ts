import { Response } from "express";

import { AuthRequest } from "../../middleware/auth.middleware";

import { ApiResponse } from "../../utils/ApiResponse";

import { STATUS } from "../../constants/statusCodes";

import { searchUsersService } from "./user.service";

export const searchUsers = async (req: AuthRequest, res: Response) => {
  const search = String(req.query.search || "");
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const result = await searchUsersService(search, req.userId!, page, limit);

  return res
    .status(STATUS.OK)
    .json(new ApiResponse(true, "Users fetched successfully", result));
};

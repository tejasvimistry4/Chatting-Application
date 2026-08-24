import { logger } from "./../../config/logger";
import { Request, Response } from "express";

import {
  loginService,
  profileService,
  registerService,
  updateProfileService,
} from "./auth.service";

import { AuthRequest } from "../../middleware/auth.middleware";
import { ApiResponse } from "../../utils/ApiResponse";
import { STATUS } from "../../constants/statusCodes";
import { MESSAGE } from "../../constants/messages";

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  logger.info(`Register request for email: ${email}`);

  const result = await registerService(fullName, email, password);
  logger.info(`User registered successfully: ${email}`);

  return res
    .status(STATUS.CREATED)
    .json(new ApiResponse(true, MESSAGE.REGISTER_SUCCESS, result));
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.info(`Login request for email: ${email}`);

  const result = await loginService(email, password);
  logger.info(`Login successful: ${email}`);

  return res
    .status(STATUS.OK)
    .json(new ApiResponse(true, MESSAGE.LOGIN_SUCCESS, result));
};

export const profile = async (req: AuthRequest, res: Response) => {
  const user = await profileService(req.userId!);

  return res
    .status(STATUS.OK)
    .json(new ApiResponse(true, MESSAGE.PROFILE_FETCHED, user));
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { fullName, avatar } = req.body;

  const user = await updateProfileService(req.userId!, fullName, avatar);

  return res
    .status(STATUS.OK)
    .json(new ApiResponse(true, MESSAGE.PROFILE_UPDATED, user));
};

import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./ApiError";
import { STATUS } from "../constants/statusCodes";
import { MESSAGE } from "../constants/messages";

export interface TokenPayload extends JwtPayload {
  id: string;
}

const ACCESS_TOKEN_OPTIONS: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, ACCESS_TOKEN_OPTIONS);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw new ApiError(STATUS.UNAUTHORIZED, MESSAGE.UNAUTHORIZED);
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  return jwt.decode(token) as TokenPayload | null;
};

import anthRepository from "../auth/auth.repository";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateAccessToken } from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";
import { STATUS } from "../../constants/statusCodes";
import { MESSAGE } from "../../constants/messages";

export const registerService = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await anthRepository.findUserByEmail(normalizedEmail);
  if (existing) {
    throw new ApiError(STATUS.CONFLICT, MESSAGE.USER_EXISTS);
  }

  const hashedPassword = await hashPassword(password);

  const user = await anthRepository.createUser({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return {
    accessToken: generateAccessToken(user.id),
    user,
  };
};

export const loginService = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await anthRepository.findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(STATUS.UNAUTHORIZED, MESSAGE.INVALID_CREDENTIALS);
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    throw new ApiError(STATUS.UNAUTHORIZED, MESSAGE.INVALID_CREDENTIALS);
  }
  return {
    accessToken: generateAccessToken(user.id),
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

export const profileService = async (userId: string) => {
  const user = await anthRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(STATUS.NOT_FOUND, MESSAGE.USER_NOT_FOUND);
  }
  return user;
};

export const updateProfileService = async (
  userId: string,
  fullName?: string,
  avatar?: string | null,
) => {
  const user = await anthRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(STATUS.NOT_FOUND, MESSAGE.USER_NOT_FOUND);
  }

  const data: {
    fullName?: string;
    avatar?: string | null;
  } = {};

  if (fullName !== undefined) {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      throw new ApiError(STATUS.BAD_REQUEST, MESSAGE.FULL_NAME_REQUIRED);
    }
    data.fullName = trimmedName;
  }
  if (avatar !== undefined) {
    data.avatar = avatar;
  }

  return anthRepository.updateUser(userId, data);
};

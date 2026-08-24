import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ApiResponse } from "../../utils/ApiResponse";
import { STATUS } from "../../constants/statusCodes";
import { MESSAGE } from "../../constants/messages";

const uploadFile = (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(new ApiResponse(false, MESSAGE.NO_FILE_UPLOAD));
  }

  const file = req.file;

  const baseUrl = process.env.API_URL || `${req.protocol}://${req.get("host")}`;

  const fileUrl = `${baseUrl}/uploads/${file.filename}`;

  return res.status(STATUS.CREATED).json(
    new ApiResponse(true, MESSAGE.FILE_UPLOADED, {
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    }),
  );
};

export default {
  uploadFile,
};

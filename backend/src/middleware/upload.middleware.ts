import multer from "multer";
import crypto from "crypto";
import path from "path";

import {
  UPLOAD_DIR,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  ensureUploadDirectory,
} from "../config/upload";

ensureUploadDirectory();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOAD_DIR);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    callback(null, filename);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return callback(new Error("File type is not allowed."));
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  fileFilter,
});

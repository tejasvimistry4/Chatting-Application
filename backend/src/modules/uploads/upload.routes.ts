import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import uploadController from "./upload.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  uploadController.uploadFile,
);

export default router;

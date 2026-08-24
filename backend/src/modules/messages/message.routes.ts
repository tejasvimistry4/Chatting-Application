import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";

import messageController from "./message.controller";

const router = Router();

router.get(
  "/:chatId/messages",
  authenticate,
  messageController.getMessages
);

export default router;

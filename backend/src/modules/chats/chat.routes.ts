import { Router } from "express";
import chatController from "./chat.controller";
import { authenticate } from "./../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createPrivateChatSchema,
  chatIdParamSchema,
  getChatsQuerySchema,
  getChatByIdQuerySchema,
} from "./chat.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/private",
  validate(createPrivateChatSchema),
  chatController.createPrivateChat,
);
router.get("/", validate(getChatsQuerySchema), chatController.getChats);
router.get(
  "/:chatId",
  validate(chatIdParamSchema.merge(getChatByIdQuerySchema)),
  chatController.getChatById,
);

export default router;

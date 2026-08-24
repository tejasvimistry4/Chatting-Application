import { Router } from "express";

import groupChatController from "./groupChat.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/group", groupChatController.createGroupChat);
router.patch("/:chatId", groupChatController.renameGroup);
router.post("/:chatId/members", groupChatController.addMembers);
router.delete("/:chatId/members/:memberId", groupChatController.removeMember);
router.post("/:chatId/leave", groupChatController.leaveGroup);
router.delete("/:chatId", groupChatController.deleteGroup);

export default router;

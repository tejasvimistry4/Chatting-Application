import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { searchUsers } from "./user.controller";

const router = Router();

router.get("/search", authenticate, searchUsers);

export default router;

import { authenticate } from "./../../middleware/auth.middleware";
import { Router } from "express";

import { register, login, profile, updateProfile } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);
router.put("/profile", authenticate, updateProfile);

export default router;

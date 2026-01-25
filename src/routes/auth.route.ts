import { Router } from "express";
import * as controller from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth";

const router = Router();

/* ------------------------------ Public Routes ------------------------------ */
router.post("/signup", controller.signUpWithEmail);
router.post("/login", controller.loginWithEmail);
router.post("/login/google", controller.loginWithGoogle);
router.post("/verify-2fa", controller.verify2FA);

/* ------------------------------ Protected Routes ------------------------------ */
router.post("/2fa/enable", authMiddleware, controller.enable2FA);
router.post("/2fa/disable", authMiddleware, controller.disable2FA);

export default router;

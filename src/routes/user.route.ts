import { Router } from "express";
import * as userController from "@/controllers/user.controller";
import { authMiddleware } from "@/middlewares/auth";
import { rolesMiddleware } from "@/middlewares/roles";

const router = Router();

// admin or self
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.patch("/:id", authMiddleware, userController.updateUser);

// admin only
router.post(
  "/",
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
  userController.createUser,
);

router.put(
  "/:id",
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
  userController.updateUser,
);

router.patch(
  "/:id",
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
  userController.updateUser,
);

router.delete(
  "/:id",
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
  userController.deleteUser,
);

export default router;

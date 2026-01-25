import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth";
import { rolesMiddleware } from "../middlewares/roles";

const router = Router();

// -------------------- ADMIN ONLY --------------------

// Get all users
router.get(
  "/",
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
  userController.getAllUsers,
);

// Create user (admin only)
router.post(
  "/",
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
  userController.createUser,
);

// Delete user
router.delete(
  "/:id",
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
  userController.deleteUser,
);

// -------------------- ADMIN OR SELF --------------------

// Get user by ID
router.get(
  "/:id",
  authMiddleware,
  rolesMiddleware(["ADMIN"], { allowOwner: true }),
  userController.getUserById,
);

// Update user (profile or admin edit)
router.patch(
  "/:id",
  authMiddleware,
  rolesMiddleware(["ADMIN"], { allowOwner: true }),
  userController.updateUser,
);

export default router;

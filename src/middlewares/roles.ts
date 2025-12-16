import { Response, NextFunction } from "express";
import { AuthRequest } from "@/interfaces/AuthRequest";

export const rolesMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

// ------------------------ Roles middleware ------------------------

// authMiddleware runs before this - verifies JWT and sets req.user

// then runs rolesMiddleware - Checks if the user has permission

// !roles.includes(req.user.role) - checks if user's role is in allowed roles

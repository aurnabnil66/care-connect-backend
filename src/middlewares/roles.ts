import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/AuthRequest";

type RolesOptions = {
  allowOwner?: boolean; // allow user to access their own resource
  paramKey?: string; // which param to match (default: "id")
};

export const rolesMiddleware = (
  roles: string[],
  options: RolesOptions = {},
) => {
  const { allowOwner = false, paramKey = "id" } = options;

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    // Role allowed
    if (roles.includes(req.user.role)) {
      return next();
    }

    // Ownership allowed (ADMIN OR OWNER)
    if (allowOwner) {
      const resourceId = Number(req.params[paramKey]);

      if (!Number.isNaN(resourceId) && req.user.id === resourceId) {
        return next();
      }
    }

    // Neither role nor owner
    return res.status(403).json({ message: "Forbidden" });
  };
};

// ------------------------ Roles middleware ------------------------

// authMiddleware runs before this - verifies JWT and sets req.user

// then runs rolesMiddleware - Checks if the user has permission

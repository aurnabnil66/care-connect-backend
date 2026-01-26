import { Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt";
import { AuthRequest } from "@/interfaces/AuthRequest";
import { JwtUserPayload } from "@/interfaces/JwtUserPayload";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization; // acquiring the token/authorization header

    // if there is no header, or header is not starting with Bearer
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const token = header.slice(7).trim(); // extracting the token from the header
    // --------------- why using slice and trim here ---------------
    // "Bearer " is 7 characters long
    // slice(7) removes the first 7 characters
    // Everything after "Bearer " is the token

    // if there is no token
    if (!token) {
      return res.status(401).json({ message: "Invalid Authorization header" });
    }

    const payload = verifyToken(token);
    req.user = payload as JwtUserPayload;

    return next(); // why return next()? - to ensure the function exits here and no duplicate response is sent
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ------------------------ Auth middleware ------------------------

// Reads the JWT from the Authorization header

// Extracts the token (Bearer <token>)

// Verifies the token

// Attaches the decoded user info to req.user

// Allows the request to continue if valid

// Blocks the request if invalid or expired

// This is used to protect routes.

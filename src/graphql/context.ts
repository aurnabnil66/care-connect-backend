import { verifyToken } from "@/utils/jwt";
import { JwtUserPayload } from "@/interfaces/JwtUserPayload";

export const createContext = ({ req }: any) => {
  const header = req?.headers?.authorization; // acquiring the token/authorization header

  // if there is no header, or header is not starting with Bearer
  if (!header || !header.startsWith("Bearer ")) {
    // NOTE: cannot use res.status here in context, return empty user
    return {};
  }

  try {
    const token = header.slice(7).trim(); // extracting the token from the header
    // --------------- why using slice and trim here ---------------
    // "Bearer " is 7 characters long
    // slice(7) removes the first 7 characters
    // Everything after "Bearer " is the token

    // if there is no token
    if (!token) {
      return {};
    }

    const payload = verifyToken(token);

    return {
      user: payload as JwtUserPayload, // attach user to context
    };
  } catch (error) {
    // NOTE: cannot use res.status here in context
    return {};
  }
};

// ------------------------ Auth middleware ------------------------

// Reads the JWT from the Authorization header

// Extracts the token (Bearer <token>)

// Verifies the token

// Attaches the decoded user info to req.user

// Allows the request to continue if valid

// Blocks the request if invalid or expired

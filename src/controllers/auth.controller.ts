import { Request, Response } from "express";
import * as authService from "@/modules/auth/auth.service";

interface ExtendsRequest extends Request {
  user: {
    id: number;
  };
}

/* ------------------------------ Email Signup ------------------------------ */
export const signUpWithEmail = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const result = await authService.signUpWithEmail({
    name,
    email,
    password,
  });

  res.status(201).json(result);
};

/* ------------------------------ Email Login ------------------------------ */
export const loginWithEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.loginWithEmail({
    email,
    password,
  });

  res.json(result);
};

/* ------------------------------ Verify 2FA ------------------------------ */
export const verify2FA = async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  const result = await authService.verify2FA(Number(userId), otp);

  res.json(result);
};

/* ------------------------------ Google Login ------------------------------ */
export const loginWithGoogle = async (req: Request, res: Response) => {
  const { email, googleId, name } = req.body;

  const result = await authService.loginWithGoogle({
    email,
    googleId,
    name,
  });

  res.json(result);
};

/* ------------------------------ Enable 2FA ------------------------------ */
export const enable2FA = async (req: ExtendsRequest, res: Response) => {
  await authService.enable2FA(req.user.id);

  res.json({ message: "2FA enabled successfully" });
};

/* ------------------------------ Disable 2FA ------------------------------ */
export const disable2FA = async (req: ExtendsRequest, res: Response) => {
  await authService.disable2FA(req.user.id);

  res.json({ message: "2FA disabled successfully" });
};

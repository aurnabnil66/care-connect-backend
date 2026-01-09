import { prisma } from "@/lib/client";
import { hashPassword, comparePassword } from "@/utils/password";
import { generateToken } from "@/utils/jwt";
import { sendMail } from "@/utils/mailer";

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const OTP_EXPIRY_MINUTES = 3;

// ------------------------------ Email Signup ------------------------------
export const signUpWithEmail = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new Error("Account already exists. Please login.");
  }

  const hashed = password && (await hashPassword(password));

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      emailVerified: false,
    },
  });

  // send verification email
  await sendVerificationEmail(newUser.id, newUser.email);

  return {
    message: "Signup successful. Please verify your email.",
  };
};

// ------------------------------ Email Login ------------------------------
export const loginWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  if (user.googleId && !user.password) {
    throw new Error("Please login with Google");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.emailVerified) {
    throw new Error("Please verify your email");
  }

  // -------------- 2FA Step --------------
  if (user.twoFAEnabled) {
    const otp = generateOTP();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFACode: otp,
        twoFAExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000), // set expiry time
      },
    });

    await send2FAEmail(user.email, otp);

    return {
      twoFARequired: true,
      userId: user.id,
      message: "OTP sent to your email",
    };
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
    email: user.email,
  });

  return { token };
};

// ----------------------- function to issue JWT token and return the token with user object -----------------------
export const issueToken = (user: any) => {
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return token;
};

// ------------------------------ Send Verification Email ------------------------------
export const sendVerificationEmail = async (userId: number, email: string) => {
  const token = generateToken({ userId, purpose: "verify-email" }, "15m");

  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await sendMail({
    to: email,
    subject: "Verify your email",
    html: `
      <h3>Welcome!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${link}">Verify Email</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });
};

// ------------------------------ Send 2FA Email ------------------------------
const send2FAEmail = async (email: string, otp: string) => {
  await sendMail({
    to: email,
    subject: "Your login code",
    html: `
      <p>Your one-time login code is:</p>
      <h2>${otp}</h2>
      <p>This code expires in 10 minutes.</p>
      <p>If this wasn't you, please ignore this email.</p>
    `,
  });
};

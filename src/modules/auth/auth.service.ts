import { prisma } from "../../lib/client";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import { sendMail } from "../../utils/mailer";

// ------------------------------ Generate OTP ------------------------------
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const OTP_EXPIRY_MINUTES = 3;

// ----------------------- function to issue JWT token and return the token with user object -----------------------
export const issueToken = (user: any) => {
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

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

  const hashedPassword = password && (await hashPassword(password));

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
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
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });

  // Check if user doesn't exist or password is incorrect
  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  // Check if user has google account and no password
  if (user.googleId && !user.password) {
    throw new Error("Please login with Google");
  }

  // match the input password with hashed password
  const isMatch = await comparePassword(password, user.password);

  // if password doesn't match
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // if email is not verified
  if (!user.emailVerified) {
    throw new Error("Please verify your email");
  }

  // -------------- 2FA Step --------------
  if (user.twoFAEnabled) {
    // if 2FA is enabled - generate OTP
    const otp = generateOTP();

    // update user with OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFACode: otp,
        twoFAExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000), // set expiry time
      },
    });

    // send 2FA email
    await send2FAEmail(user.email, otp);

    return {
      twoFARequired: true,
      userId: user.id,
      message: "OTP sent to your email",
    };
  }

  // if 2FA is not enabled - issue JWT token and return
  return issueToken(user);
};

// ------------------------------ Verify 2FA ------------------------------
export const verify2FA = async (userId: number, otp: string) => {
  const user = await prisma.user?.findUnique({ where: { id: userId } });

  // if user doesn't exist or 2FA is not enabled
  if (!user || !user.twoFACode || !user.twoFAExpires) {
    throw new Error("2FA is not enabled for this user");
  }

  // if 2FA expires before current date
  if (user.twoFAExpires < new Date()) {
    throw new Error("OTP expired");
  }

  // if OTP doesn't match
  if (user.twoFACode !== otp) {
    throw new Error("Invalid OTP");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFACode: null,
      twoFAExpires: null,
    },
  });

  // issue JWT token and return
  return issueToken(user);
};

// ------------------------------ Login with Google ------------------------------
export const loginWithGoogle = async ({
  email,
  googleId,
  name,
}: {
  email: string;
  googleId: string;
  name: string;
}) => {
  // check if user with google id already exists
  let user = await prisma.user.findUnique({ where: { googleId } });

  // if user exists, issue JWT token
  if (user) {
    issueToken(user);
  }

  // link with existing account with same email
  const byEmail = await prisma.user.findUnique({ where: { email } });

  if (byEmail) {
    user = await prisma.user.update({
      where: { id: byEmail.id },
      data: {
        googleId,
        emailVerified: true, // Google emails are verified
        name: byEmail.name || name,
      },
    });

    return issueToken(user);
  }

  // create new user
  user = await prisma.user.create({
    data: {
      name: name ?? "Google User",
      email,
      googleId,
      emailVerified: true, // Google emails are verified
    },
  });

  return issueToken(user);
};

// ------------------------------ Enable/Disable 2FA ------------------------------
export const enable2FA = async (userId: number) => {
  await prisma.user.update({
    where: { id: userId },
    data: { twoFAEnabled: true },
  });
};

export const disable2FA = async (userId: number) => {
  await prisma.user.update({
    where: { id: userId },
    data: { twoFAEnabled: false },
  });
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

import { prisma } from "@/lib/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@/generated/enums";

export const authService = {
  // Register admin - approval required from existing admin
  async registerAdmin(data: { email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Admin already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: Role.ADMIN,
        isVerified: true,
      },
    });

    const adminProfile = await prisma.adminProfile.create({
      data: {
        userId: user.id,
        approval: false, // set approval to false,
      },
    });

    return {
      userId: user.id,
      email: user.email,
      approval: adminProfile.approval,
    };
  },

  // Login admin
  async loginAdmin(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        adminProfile: true,
      },
    });

    if (!user) throw new Error("Invalid email or password");

    const isValid = await bcrypt.compare(data.password, user.password!);
    if (!isValid) throw new Error("Invalid email or password");

    // check approval
    if (user.role === Role.ADMIN && !user.adminProfile?.approval) {
      throw new Error("Admin account is waiting for approval");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { algorithm: "HS256" },
    );

    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    const tokenWithExpiration = `${token};expires=${expiresIn}`;

    return {
      token: tokenWithExpiration,
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  },

  // Get admin profile
  async getAdminProfile(userId: number) {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { userId },
      include: {
        user: true, // fetches email, role, etc.
      },
    });

    if (!adminProfile) throw new Error("Admin profile not found");

    return {
      userId: adminProfile.userId,
      email: adminProfile.user.email,
      role: adminProfile.user.role,
      approval: adminProfile.approval,
    };
  },
};

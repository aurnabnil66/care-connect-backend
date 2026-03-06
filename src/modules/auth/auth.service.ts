import { prisma } from "@/lib/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@/generated/enums";

export const authService = {
  // Create / Register admin
  async createAdmin(data: { email: string; password: string }) {
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

    await prisma.adminProfile.create({
      data: {
        userId: user.id,
      },
    });

    return {
      userId: user.id,
      email: user.email,
    };
  },

  // Login admin
  async loginAdmin(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new Error("Invalid email or password");

    // Check password
    const isValid = await bcrypt.compare(data.password, user.password!);
    if (!isValid) throw new Error("Invalid email or password");

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { algorithm: "HS256" }, // specify the algorithm if needed
    );

    // Set the expiration time separately
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    const tokenWithExpiration = `${token};expires=${expiresIn}`;

    return {
      token: tokenWithExpiration,
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  },
};

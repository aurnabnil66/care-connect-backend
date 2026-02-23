import { prisma } from "@/lib/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@/generated/enums";

export const authService = {
  // Create admin
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

  async getAdminProfileByUserId(userId: string) {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { userId: Number(userId) },
      include: {
        user: true, // optional but useful
      },
    });

    if (!adminProfile) {
      // Handle the case when adminProfile is undefined
      return null;
    }

    // Access the user property safely
    return adminProfile.user;
  },

  //   async createHospital(data: { name: string; address: string; city: string }) {
  //     return prisma.hospital.create({
  //       data,
  //     });
  //   },

  //   async getAllHospitals() {
  //     return prisma.hospital.findMany({
  //       orderBy: { createdAt: "desc" },
  //     });
  //   },
};

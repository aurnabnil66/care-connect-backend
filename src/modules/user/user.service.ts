import { prisma } from "@/lib/client";

// ------------------------------ Create User ------------------------------
export const createUser = async (data: {
  name: string;
  email: string;
  role?: "PATIENT" | "DOCTOR" | "ADMIN";
  phone?: string;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      emailVerified: false,
    },
  });
};

// ------------------------------ Get all users ------------------------------
export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
    },
  });
};

// ------------------------------ Get user by id ------------------------------
export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// ------------------------------ Update user ------------------------------
export const updateUser = async (
  userId: number,
  data: Partial<{
    name: string;
    phone: string;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
  }>,
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

// ------------------------------ Delete user ------------------------------
export const deleteUser = async (userId: number) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};

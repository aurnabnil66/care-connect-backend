import { prisma } from "@/lib/client";

export const adminService = {
  // Get Pending Admins
  async getPendingAdmins() {
    const pendingAdmins = await prisma.adminProfile.findMany({
      where: {
        approval: false,
      },
      include: {
        user: true, // includes related user
      },
    });

    if (pendingAdmins.length === 0) {
      throw new Error("No pending admins found");
    }

    return pendingAdmins.map((admin) => ({
      userId: admin.userId,
      email: admin.user.email,
      approval: admin.approval,
    }));
  },

  async approveByAdmin(userId: number, approval: boolean) {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { userId },
      include: {
        user: true, // includes related user
      },
    });

    if (!adminProfile) {
      throw new Error("Admin profile not found");
    }

    if (adminProfile.approval) {
      throw new Error("Admin is already approved");
    }

    const updatedAdmin = await prisma.adminProfile.update({
      where: { userId },
      data: { approval: approval },
      include: { user: true },
    });

    return {
      userId: updatedAdmin.userId,
      email: updatedAdmin.user.email,
      approval: updatedAdmin.approval,
    };
  },

  async createHospital(data: { name: string; address: string; city: string }) {
    return prisma.hospital.create({
      data,
    });
  },

  async getAllHospitals() {
    return prisma.hospital.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
};

import { prisma } from "@/lib/client";

export const adminService = {
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

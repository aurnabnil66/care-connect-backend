import { prisma } from "@/lib/client";
import bcrypt from "bcryptjs";
import { Role } from "@/generated/enums";

export const adminService = {
  // ---------------------------- create admin - existing admin will create another admin ----------------------------
  async createAdmin(data: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
  }) {
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
        name: data.name,
        phone: data.phone,
        approval: true, // set approval to true
      },
    });

    return {
      userId: user.id,
      email: user.email,
      name: adminProfile.name,
      phone: adminProfile.phone,
      approval: adminProfile.approval,
    };
  },

  // ---------------------------- update admin - existing admin will update another admin ----------------------------
  async updateAdmin(data: {
    userId: number;
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
  }) {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { userId: data.userId },
      include: {
        user: true, // includes related user
      },
    });

    if (!adminProfile) {
      throw new Error("Admin profile not found");
    }

    const updatedAdminData: any = {};

    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== data.userId) {
        throw new Error("Email already in use");
      }

      updatedAdminData.email = data.email;
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updatedAdminData.password = hashedPassword;
    }

    if (data.name) {
      const existingName = await prisma.adminProfile.findFirst({
        where: {
          name: data.name,
          NOT: { userId: data.userId }, // exclude the current admin
        },
      });

      if (existingName && existingName.userId !== data.userId) {
        throw new Error("Name already in use");
      }

      updatedAdminData.name = data.name;
    }

    if (data.phone) {
      const existingPhone = await prisma.adminProfile.findFirst({
        where: {
          phone: data.phone,
          NOT: { userId: data.userId }, // exclude the current admin
        },
      });

      if (existingPhone && existingPhone.userId !== data.userId) {
        throw new Error("Phone number already in use");
      }

      updatedAdminData.phone = data.phone;
    }

    // Prevent empty update
    if (Object.keys(updatedAdminData).length === 0) {
      throw new Error("No data provided to update");
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: data.userId },
      data: {
        ...(updatedAdminData.email && { email: updatedAdminData.email }),
        ...(updatedAdminData.password && {
          password: updatedAdminData.password,
        }),
        adminProfile: {
          update: {
            ...(updatedAdminData.name && { name: updatedAdminData.name }),
            ...(updatedAdminData.phone && { phone: updatedAdminData.phone }),
          },
        },
      },
      include: { adminProfile: true },
    });

    return {
      userId: updatedAdmin.id,
      email: updatedAdmin.email,
      name: updatedAdmin.adminProfile?.name,
      phone: updatedAdmin.adminProfile?.phone,
      approval: updatedAdmin.adminProfile?.approval,
    };
  },

  // ---------------------------- delete admin - existing admin will delete another admin ----------------------------
  async deleteAdmin(data: { userId: number }) {
    // find the admin profile by ID - which will be deleted
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { userId: data.userId },
      include: {
        user: true, // includes related user
      },
    });

    if (!adminProfile) {
      throw new Error("Admin profile not found");
    }

    const userId = adminProfile.userId;

    // delete profile first (foreign key safe)
    await prisma.adminProfile.delete({
      where: { userId: adminProfile.userId },
    });

    // delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      userId: adminProfile.userId,
      email: adminProfile.user.email,
      name: adminProfile.name,
      phone: adminProfile.phone,
      approval: adminProfile.approval,
    };
  },

  // ---------------------------- Get All Admins ----------------------------
  async getAllAdmins() {
    const admins = await prisma.adminProfile.findMany({
      include: {
        user: true, // includes related user
      },
      orderBy: { createdAt: "desc" },
    });

    if (admins.length === 0) {
      throw new Error("No admins found");
    }

    return admins.map((admin) => ({
      userId: admin.userId,
      email: admin.user.email,
      name: admin.name,
      phone: admin.phone,
      approval: admin.approval,
    }));
  },

  // ---------------------------- Get Pending Admins ----------------------------
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

  // ---------------------------- Approve Admin ----------------------------
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
      where: { userId: userId },
      data: { approval: approval },
      include: { user: true },
    });

    return {
      userId: updatedAdmin.userId,
      email: updatedAdmin.user.email,
      approval: updatedAdmin.approval,
    };
  },

  // ---------------------------- create Hospital ----------------------------
  async createHospital(data: { name: string; address: string; city: string }) {
    return prisma.hospital.create({
      data,
    });
  },

  // ---------------------------- update Hospital ----------------------------
  async updateHospital(data: {
    id: number;
    name?: string;
    address?: string;
    city?: string;
  }) {
    return prisma.hospital.update({
      where: { id: data.id },
      data,
    });
  },

  // ---------------------------- delete Hospital ----------------------------
  async deleteHospital(id: number) {
    await prisma.hospital.delete({
      where: { id },
    });

    return true;
  },

  // ---------------------------- Get All Hospitals ----------------------------
  async getAllHospitals() {
    return prisma.hospital.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // ---------------------------- Get Hospital By Id ----------------------------
  async getHospitalById(id: number) {
    return prisma.hospital.findUnique({
      where: { id },
    });
  },
};

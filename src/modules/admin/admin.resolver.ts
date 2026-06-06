import { DateTimeResolver } from "graphql-scalars";
import { adminService } from "./admin.service";

export const adminResolvers = {
  DateTime: DateTimeResolver,

  // ---------------------------- Queries ----------------------------
  Query: {
    getAllAdmins: async () => {
      try {
        return await adminService.getAllAdmins();
      } catch (error) {
        console.error("Get All Admins Error:", error);
        throw error;
      }
    },

    getPendingAdmins: async () => {
      try {
        return await adminService.getPendingAdmins();
      } catch (error) {
        console.error("Get Pending Admins Error:", error);
        throw error;
      }
    },
  },

  // ---------------------------- Mutations ----------------------------
  Mutation: {
    createAdmin: async (
      _: any,
      {
        input,
      }: {
        input: {
          email: string;
          password: string;
          name?: string;
          phone?: string;
        };
      },
      context: any,
    ) => {
      try {
        if (!context.user) throw new Error("Not authenticated");

        return await adminService.createAdmin(input);
      } catch (error) {
        console.error("Create Admin Error:", error);
        throw error;
      }
    },

    updateAdmin: async (
      _: any,
      {
        input,
      }: {
        input: {
          userId: number;
          email?: string;
          password?: string;
          name?: string;
          phone?: string;
        };
      },
      context: any,
    ) => {
      try {
        if (!context.user) throw new Error("Not authenticated");

        return await adminService.updateAdmin(input);
      } catch (error) {
        console.error("Update Admin Error:", error);
        throw error;
      }
    },

    deleteAdmin: async (
      _: any,
      { input }: { input: { userId: number } },
      context: any,
    ) => {
      try {
        if (!context.user) throw new Error("Not authenticated");

        return await adminService.deleteAdmin(input);
      } catch (error) {
        console.error("Delete Admin Error:", error);
        throw error;
      }
    },

    approveByAdmin: async (
      _: any,
      { input }: { input: { userId: number; approval: boolean } },
      context: any,
    ) => {
      try {
        if (!context.user) throw new Error("Not authenticated");

        return await adminService.approveByAdmin(input.userId, input.approval);
      } catch (error) {
        console.error("Admin approval error:", error);
        throw error;
      }
    },
  },
};

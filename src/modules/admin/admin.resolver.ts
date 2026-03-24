import { DateTimeResolver } from "graphql-scalars";
import { adminService } from "./admin.service";
import { authorize } from "@/graphql/authorize";

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

    getAllHospitals: async () => {
      try {
        return await adminService.getAllHospitals();
      } catch (error) {
        console.error("Get All Hospitals Error:", error);
        throw error;
      }
    },

    getHospitalById: async (_: any, { id }: { id: number }) => {
      try {
        return await adminService.getHospitalById(id);
      } catch (error) {
        console.error("Get Hospital By ID Error:", error);
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
    ) => {
      try {
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
    ) => {
      try {
        return await adminService.updateAdmin(input);
      } catch (error) {
        console.error("Update Admin Error:", error);
        throw error;
      }
    },

    deleteAdmin: async (_: any, { input }: any) => {
      try {
        return await adminService.deleteAdmin(input);
      } catch (error) {
        console.error("Delete Admin Error:", error);
        throw error;
      }
    },

    approveByAdmin: async (
      _: any,
      { input }: { input: { userId: number; approval: boolean } },
    ) => {
      try {
        return await adminService.approveByAdmin(input.userId, input.approval);
      } catch (error) {
        console.error("Admin approval error:", error);
        throw error;
      }
    },

    createHospital: authorize(["ADMIN"])(
      async (
        _: any,
        { input }: { input: { name: string; address: string; city: string } },
        context: any,
      ) => {
        if (!context.user) throw new Error("Not authenticated");

        // Create a new hospital using the input
        return adminService.createHospital(input);
      },
    ),

    updateHospital: async (_: any, { input }: any) => {
      try {
        return await adminService.updateHospital(input);
      } catch (error) {
        console.error("Update Hospital Error:", error);
        throw error;
      }
    },

    deleteHospital: async (_: any, { input }: any) => {
      try {
        return await adminService.deleteHospital(input.id);
      } catch (error) {
        console.error("Delete Hospital Error:", error);
        throw error;
      }
    },
  },
};

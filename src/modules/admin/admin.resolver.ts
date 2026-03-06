import { DateTimeResolver } from "graphql-scalars";
import { adminService } from "./admin.service";
import { authorize } from "@/graphql/authorize";

export const adminResolvers = {
  DateTime: DateTimeResolver,

  Query: {
    pendingAdmins: async () => {
      try {
        return await adminService.getPendingAdmins();
      } catch (error) {
        console.error("Get Pending Admins Error:", error);
        throw error;
      }
    },
  },

  Mutation: {
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
  },
};

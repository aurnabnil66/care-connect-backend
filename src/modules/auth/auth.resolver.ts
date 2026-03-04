import { DateTimeResolver } from "graphql-scalars";
import { authService } from "./auth.service";
import { authorize } from "@/graphql/authorize";
import { Role } from "@/generated/enums";

export const authResolvers = {
  DateTime: DateTimeResolver,

  Query: {
    getAdminProfile: async (_: any, __: any, context: any) => {
      // Defensive check
      if (!context.user) throw new Error("Not authenticated");

      // Fetch admin profile by user ID and include user details
      return authService.getAdminProfileByUserId(context.user.id);
    },

    // getAllHospitals: authorize(["ADMIN"])(
    //   async (_: any, __: any, context: any) => {
    //     // context.user is available if needed
    //     return adminService.getAllHospitals();
    //   },
    // ),
  },

  Mutation: {
    createAdmin: async (
      _: any,
      { input }: { input: { email: string; password: string } },
    ) => {
      try {
        return await authService.createAdmin(input);
      } catch (error) {
        console.error("CREATE ADMIN ERROR:", error);
        throw error;
      }
    },

    loginAdmin: async (
      _: any,
      { input }: { input: { email: string; password: string } },
    ) => {
      return await authService.loginAdmin(input);
    },

    // createHospital: authorize(["ADMIN"])(
    //   async (
    //     _: any,
    //     { input }: { input: { name: string; address: string; city: string } },
    //     context: any,
    //   ) => {
    //     if (!context.user) throw new Error("Not authenticated");

    //     // Create a new hospital using the input
    //     return adminService.createHospital(input);
    //   },
    // ),
  },
};

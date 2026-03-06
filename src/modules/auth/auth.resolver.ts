import { DateTimeResolver } from "graphql-scalars";
import { authService } from "./auth.service";

export const authResolvers = {
  DateTime: DateTimeResolver,

  Query: {
    getAdminProfile: async (_: any, __: any, context: any) => {
      const userId = context.user?.id;
      // Defensive check
      if (!userId) throw new Error("Not authenticated");

      // Fetch admin profile by user ID and include user details
      return await authService.getAdminProfile(userId);
    },
  },

  Mutation: {
    createAdmin: async (
      _: any,
      { input }: { input: { email: string; password: string } },
    ) => {
      try {
        return await authService.createAdmin(input);
      } catch (error) {
        console.error("Create Admin Error:", error);
        throw error;
      }
    },

    registerAdmin: async (
      _: any,
      { input }: { input: { email: string; password: string } },
    ) => {
      try {
        return await authService.registerAdmin(input);
      } catch (error) {
        console.error("Register Admin Error:", error);
        throw error;
      }
    },

    loginAdmin: async (
      _: any,
      { input }: { input: { email: string; password: string } },
    ) => {
      try {
        return await authService.loginAdmin(input);
      } catch (error) {
        console.error("Login Admin Error:", error);
        throw error;
      }
    },
  },
};

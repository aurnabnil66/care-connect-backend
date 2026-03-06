import { DateTimeResolver } from "graphql-scalars";
import { authService } from "./auth.service";

export const authResolvers = {
  DateTime: DateTimeResolver,

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
        await authService.loginAdmin(input);
      } catch (error) {
        console.error("Login Admin Error:", error);
        throw error;
      }
    },
  },
};

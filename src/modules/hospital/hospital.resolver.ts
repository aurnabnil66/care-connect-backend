import { DateTimeResolver } from "graphql-scalars";
import { hospitalService } from "./hospital.service";

export const hospitalResolvers = {
  DateTime: DateTimeResolver,

  // ---------------------------- Queries ----------------------------
  Query: {
    getAllHospitals: async () => {
      try {
        return await hospitalService.getAllHospitals();
      } catch (error) {
        console.error("Get All Hospitals Error:", error);
        throw error;
      }
    },

    getHospitalById: async (_: any, { id }: { id: number }) => {
      try {
        return await hospitalService.getHospitalById({ id });
      } catch (error) {
        console.error("Get Hospital By Id Error:", error);
        throw error;
      }
    },
  },

  // ---------------------------- Mutations ----------------------------
  Mutation: {
    createHospital: async (
      _: any,
      { input }: { input: { name: string; address: string; city: string } },
      context: any,
    ) => {
      try {
        if (!context.user) throw new Error("Not authenticated");

        // Create a new hospital using the input
        return hospitalService.createHospital(input);
      } catch (error) {
        console.error("Create Hospital Error:", error);
        throw error;
      }
    },

    updateHospital: async (
      _: any,
      {
        input,
      }: {
        input: { id: number; name?: string; address?: string; city?: string };
      },
      context: any,
    ) => {
      try {
        if (!context.user) throw new Error("Not authenticated");

        // Update an existing hospital using the input
        return hospitalService.updateHospital(input);
      } catch (error) {
        console.error("Update Hospital Error:", error);
        throw error;
      }
    },

    deleteHospital: (
      _: any,
      {
        input,
      }: {
        input: { id: number; name?: string; address?: string; city?: string };
      },
      context: any,
    ) => {
      try {
        if (!context.user) throw new Error("Not authenticated");

        // Delete an existing hospital using the input
        return hospitalService.deleteHospital(input);
      } catch (error) {
        console.error("Delete Hospital Error:", error);
        throw error;
      }
    },
  },
};

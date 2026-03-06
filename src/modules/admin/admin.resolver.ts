import { DateTimeResolver } from "graphql-scalars";
import { adminService } from "./admin.service";
import { authorize } from "@/graphql/authorize";
import { Role } from "@/generated/enums";

export const adminResolvers = {
  DateTime: DateTimeResolver,

  Mutation: {
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

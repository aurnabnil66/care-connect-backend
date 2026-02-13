import { prismaClientVal } from "@/lib/client";

export const createContext = ({ req }: any) => {
  return {
    prismaClientVal,
    req,
  };
};

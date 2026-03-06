import express from "express";
import cors from "cors";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { createContext } from "@/graphql/context";
import { authTypeDefs } from "./modules/auth/auth.schema";
import { authResolvers } from "./modules/auth/auth.resolver";
import { adminTypeDefs } from "./modules/admin/admin.schema";
import { adminResolvers } from "./modules/admin/admin.resolver";

export const app = express();

export const httpServer = http.createServer(app);

// Create Apollo Server
const server = new ApolloServer({
  typeDefs: [authTypeDefs, adminTypeDefs],
  resolvers: [authResolvers, adminResolvers],
});

async function startServer() {
  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => createContext({ req }),
    }),
  );
}

startServer();

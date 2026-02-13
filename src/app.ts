import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolver";
import { createContext } from "@/graphql/context";

dotenv.config();

export const app = express();

export const httpServer = http.createServer(app);

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
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

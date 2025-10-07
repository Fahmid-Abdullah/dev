import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { verifyToken } from "./auth";
import dotenv from "dotenv";

const app = express();
dotenv.config();

// Middleware to extract JWT
app.use((req, _, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  (req as any).user = token ? verifyToken({ token }) : null;
  next();
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      user: (req as any).user,
    }),
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Apollo Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();

import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "../graphql/schema";
import { resolvers } from "../graphql/resolvers";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();

    server.applyMiddleware({ app, path: "/graphql" })

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer()
    .catch((err) => console.log(err));
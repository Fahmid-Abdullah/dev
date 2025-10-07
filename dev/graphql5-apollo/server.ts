import express from "express";
import dotenv from "dotenv";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";
import { ApolloServer } from "apollo-server-express";
import { VerifyToken } from "./auth";

const PORT = process.env.PORT || 4000;

const app = express(); // Creating an express instance

dotenv.config(); // Initializing dotenv to use .env variables

app.use((req, _, next) => {
    const token = req.headers.authorization?.replace("Bearer", "");
    (req as any).user = token ? VerifyToken({ token }) : null;
    next();
})

async function main() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => (
            { user: (req as any).user }
        )
    });

    await server.start();
    server.applyMiddleware({ app });

app.listen({ port: PORT }, () => {
    console.log(`Listening on PORT: ${server.graphqlPath}`);
});
}

main()
    .catch((err) => console.log(err));
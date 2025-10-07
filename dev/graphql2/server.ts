import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

const PORT = process.env.PORT || 4000;

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/graphql", graphqlHTTP((req, res) => ({
    schema,
    rootValue: resolvers,
    context: { req, res },
    graphiql: true,
})));

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
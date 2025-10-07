import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute";
import cookieParser from "cookie-parser";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/graphql", graphqlHTTP((req, res) => ({
  schema,
  rootValue: resolvers,
  context: { req, res },
  graphiql: true,
})));

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})


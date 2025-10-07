import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./userRoutes/user";

const app = express();

app.use(express.json());
app.use("/user", userRoutes);

dotenv.config();

app.listen(4000, () => {
    console.log(`Listening on PORT 4000`);
})
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT;

app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})
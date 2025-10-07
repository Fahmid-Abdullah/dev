import { Router } from "express";
import bcrypt from "bcrypt";
import PrismaClient from "../lib/prisma";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware";

const router = Router();
const prisma = PrismaClient

router.post("/register", async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    
    try {
        const hashedPass = await bcrypt.hash(password, 10);
        const user = await prisma.user.upsert({
            where: {
                email
            },
            update: {},
            create: {
                email,
                firstName,
                lastName,
                password: hashedPass
            }
        })
        res.status(201).json({ user });
    } catch (err) {
        res.status(400).json({ message: `Registration Unsuccessful: ${err}` })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(400).json({ message: "Not Found. Please register." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(400).json({ message: `Login Failed. Please try again.` });
        }

        const token = jwt.sign({ userId: user.id }, "43ewdsfc453", { expiresIn: '1h' });
        res.status(200).json({ message: `Successful Login. Hello ${user.firstName}. Your Token is: ${token}` });
    } catch (err) {
        res.status(400).json({ message: `Registration Unsuccessful: ${err}` });
    }
})

router.get("/", verifyToken, (req, res) => {
    res.status(200).json({ message: "Protected route accessed." });
})

export default router;
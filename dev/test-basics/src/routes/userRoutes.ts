import express, { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user =  await prisma.user.upsert({
            where: {
                email,
            },
            update: {},
            create: {
                email
            }
        })
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: "Bad Request.", err: err });
    }
})

export default router;
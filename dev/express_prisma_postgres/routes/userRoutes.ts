import { Router } from "express";
import prisma from "../lib/prisma";


const router = Router()

router.get("/", async (_req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
});

router.post("/", async(req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.upsert({
            where: {
                email,
                },
                update: {},
                create: {
                    email
                }
        })

        res.status(201).json({ user })
    } catch (err) {
        res.status(400).json( { message: "Something went wrong." } )
    }
})

export default router;
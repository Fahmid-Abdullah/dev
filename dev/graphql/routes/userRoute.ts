import { Router } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/getUser", async (req, res) => {
    const { email } = req.body;

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (user) {
        return res.status(200).json({ message: "User found.", user });
    } else {
        return res.status(400).json({ error: "User not found." })
    };
})

router.post("/createUser", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (user) {
        return res.status(200).json({ message: "User already exists. Please log in.", user });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const createdUser =  await prisma.user.create({
        data: {
            email,
            password: hashedPass
        }
    })

    if (createdUser) {
        res.status(201).send({ message: `User created successfully. Welcome ${createdUser.email}` });
    } else {
        return res.status(400).json({ message: "Something went wrong. Please try again later." });
    }
});

router.post("/loginUser", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(400).send({ error: `Incorrect email or password.` });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(200).send({ error: "Incorrect email or password." });
    }

    if (process.env.SECRET_TOKEN) {
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,       // prevents JS access (XSS protection)
            secure: true,         // cookie only sent over HTTPS
            sameSite: "strict",   // CSRF protection
            maxAge: 60 * 60 * 1000 // 1h in ms
        });

        return res.status(200).send({ message: `Login Successful` });
    } else {
        return res.status(400).send({ message: "Failed to create session." });
    }
    
})

export default router;
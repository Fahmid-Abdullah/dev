type UserPayload <T> = {
    success: boolean
    message: string
    user?: T
    token?: string
}

import { User } from "../generated/prisma"
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const resolvers = {
    me: async (_: any, context: any) => {
        const { req } = context;

        try {
            const token = req.cookies?.token;
            if (!token) return null;

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            return prisma.user.findUnique({
                where: { id: decoded.userId },
            })
        } catch (err) {
            return null;
        }
    },

    getUser: async ({ email }: { email: string }) => { 
        return prisma.user.findUnique({
            where: { email }
        })
    },

    getUsers: async () => { 
        return prisma.user.findMany();
    },

    createUser: async({ firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }): Promise<UserPayload<User>> => {
        const userToFind = await prisma.user.findUnique({ where: { email } });

        if (userToFind) {
            return {
                success: false,
                message: "User already exists. Please log in.",
            }
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                firstName, 
                lastName,
                email,
                password: hashedPass
            }
        });

        return {
            success: true,
            message: "User created successfully.",
            user: newUser
        }
    },

    loginUser: async ({ email, password }: { email: string, password: string }): Promise<UserPayload<User>> => {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return {
                success: false,
                message: "Invalid username or password.",
            }
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return {
                success: false,
                message: "Invalid username or password.",
            }
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        return {
            success: true,
            message: "Login Successful.",
            user: user,
            token
        }

    }
}
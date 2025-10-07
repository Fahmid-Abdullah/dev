import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type UserPayload <T> = {
    success: boolean,
    message?: string,
    user?: T,
    token?: string
}

export const resolvers = {
    me: async (_: any, context: any) => {
        const { req } = context;
        
        try {
            const token = req.cookies?.token;
            if (!token) return null;
            
            const decoded: any = jwt.verify(token, process.env.JWTSECRET as string);
            return prisma.user.findUnique({
                where: {
                    id: decoded.userId
                }
            })
        } catch (err) {
            console.log("Invalid Token");
            return null;
        }
    },

    getUser: async ({ email }: { email: string }) => {
        return prisma.user.findUnique({
            where: { email }
        })
    },

    getAllUsers: async () => {
        return prisma.user.findMany();
    },

    getPosts: async ({ email }: { email: string }) => {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        return prisma.post.findMany({
            where: {
                authorId: user?.id
            },
            include: {
                author: true
            }
        });
    },

    createUser: async (
        { firstName, lastName, email, password }: 
        { firstName: string, lastName: string, email: string, password: string }): Promise<UserPayload<any>> => {
            const oldUser = await prisma.user.findUnique({
                where: { email }
            });

            if (oldUser) {
                return {
                    success: false,
                    message: "User already exists"
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
                message: "User successfully created.",
                user: newUser,
            }
    },

    loginUser: async ({ email, password }: { email: string, password: string }): Promise<UserPayload<any>> => {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return {
                success: false,
                message: "Email/Password Incorrect."
            };
        }

        const isPasswordMatch = bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return {
                success: false,
                message: "Email/Password Incorrect."
            };
        };

        const token = jwt.sign({ userId: user.id }, process.env.JWTSECRET as string, { expiresIn: "1h" });

        return {
            success: true,
            message: "Login Successful.",
            user: user,
            token
        }

    },

    createPost: async ({ email, password, title }: { email: string, password: string, title: string }) => {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) return null;

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) return null;

        const newPost = await prisma.post.create({
            data: {
                title,
                authorId: user.id
            },
            include: {
                author: true
            }
        });

        return newPost;

    }
}
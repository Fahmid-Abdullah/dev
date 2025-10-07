import { GenerateToken } from "../auth";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

export const resolvers = {
    Query: {
        me: async (_:any, __: any, context: any) => {
            if (!context.user) return null;
            return prisma.user.findUnique({
                where: {
                    id: context.user.id
                }
            });
        },
        getUser: async (_:any, { email }: { email: string }) => {
            return prisma.user.findUnique({
                where: { email }
            });
        },
        getAllUsers: async () => {
            return prisma.user.findMany({
                include: { posts: true }
            });
        },
        getUserPosts: async (_:any, __: any, context: any) => {
            if (!context.user) return null;
            return prisma.post.findMany({
                where: {
                    authorId: context.user.id
                },
                include: {
                    author: true
                }
            });
        }
    },
    Mutation: {
        createUser: async (_: any, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (user) {
                return {
                    success: false,
                    message: "User already exists"
                }
            }

            const hashedPass = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    firstName, lastName, email, password: hashedPass
                }
            });

            return {
                success: true,
                message: "User created successfully.",
                user: newUser
            }

        },
        loginUser: async (_: any, { email, password }: { email: string, password: string }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (!user) {
                return {
                    success: false,
                    message: "A user with the given email couldn't be found."
                }
            };

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return {
                    success: false,
                    message: "Email/Password Incorrect."
                }
            };

            const token = GenerateToken({ id: user.id, email: user.email });

            return {
                success: true,
                message: "Login Successfull!",
                user,
                token
            }
        },
        createPost: async (_: any, { title }: { title: string }, context: any) => {
            if (!context.user) return null;
            const user = await prisma.user.findUnique({
                where: {
                    id: context.user.id
                }
            });

            if (!user) {
                return null;
            }

            return prisma.post.create({
                data: {
                    title,
                    author: {
                        connect: {
                            id: context.user.id
                        }
                    }
                },
                include: {
                    author: true
                }
            });
        }
    }
}
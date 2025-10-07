// src/graphql/resolvers.ts
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRATION = 60 * 60 * 1000; // 1 hour

export const resolvers = {
  // -------------------- Queries --------------------
  me: async (_: any, context: any) => {
    const { req } = context;
    try {
      const token = req.cookies?.token;
      if (!token) return null;

      const decoded: any = jwt.verify(token, process.env.SECRET_TOKEN!);
      return prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { posts: true },
      });
    } catch {
      return null;
    }
  },

  getUser: async ({ email }: { email: string }) => {
    return prisma.user.findUnique({
      where: { email },
      include: { posts: true },
    });
  },

  getUsers: async () => {
    return prisma.user.findMany({ include: { posts: true } });
  },

  getPosts: async () => {
    return prisma.post.findMany({ include: { author: true } });
  },

  // -------------------- Mutations --------------------
  createUser: async (
    { email, password }: { email: string; password: string },
    context: any
  ) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "User already exists. Please log in." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return {
      success: true,
      message: `User created successfully. Welcome ${newUser.email}`,
      user: newUser,
    };
  },

  loginUser: async (
    { email, password }: { email: string; password: string },
    context: any
  ) => {
    const { res } = context;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, message: "Incorrect email or password." };

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return { success: false, message: "Incorrect email or password." };

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN!, {
      expiresIn: "1h",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: TOKEN_EXPIRATION,
    });

    return {
      success: true,
      message: "Login Successful",
      token, // optional: return token for API clients
      user: { id: user.id, email: user.email },
    };
  },

  createPost: async (
    { title }: { title: string },
    context: any
  ) => {
    const { req } = context;

    try {
      const token = req.cookies?.token;
      if (!token) throw new Error("Not authenticated");

      const decoded: any = jwt.verify(token, process.env.SECRET_TOKEN!);

      const newPost = await prisma.post.create({
        data: {
          title,
          authorId: decoded.userId,
        },
        include: { author: true },
      });

      return { success: true, post: newPost };
    } catch {
      return { success: false, message: "Authentication failed" };
    }
  },
};

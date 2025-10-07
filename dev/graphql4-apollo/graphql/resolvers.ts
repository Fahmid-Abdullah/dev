import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { generateToken } from "../auth";

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      return prisma.user.findUnique({
        where: { id: context.user.id },
      });
    },
    getUser: async (_: any, { email }: { email: string }) => {
      return prisma.user.findUnique({ where: { email } });
    },
    getUsers: async () => prisma.user.findMany(),
  },

  Mutation: {
    createUser: async (
      _: any,
      { firstName, lastName, email, password }: any
    ) => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        return { success: false, message: "User already exists." };

      const hashed = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { firstName, lastName, email, password: hashed },
      });

      return {
        success: true,
        message: "User created successfully.",
        user: newUser,
      };
    },

    loginUser: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return { success: false, message: "User not found." };

      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        return { success: false, message: "Invalid email or password." };

      const token = generateToken({ id: user.id, email: user.email });
      return { success: true, message: "Login successful.", user, token };
    },
  },
};

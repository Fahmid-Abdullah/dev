// resolvers/index.ts
import prisma from "../lib/prisma";
import redis from "../lib/redis";

export const resolvers = {
  Query: {
    users: async () => {
      const cacheKey = "users:all";

      // Check cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("🧠 Cache hit");
        return JSON.parse(cached);
      }

      console.log("💾 Cache miss - querying Prisma");
      const users = await prisma.user.findMany();

      // Cache result for 60 seconds
      await redis.set(cacheKey, JSON.stringify(users), "EX", 60);

      return users;
    },
  },

  Mutation: {
    createUser: async (_: any, { name, email }: { name: string; email: string }) => {
      const newUser = await prisma.user.create({
        data: { name, email },
      });

      // Invalidate users cache so new data appears next fetch
      await redis.del("users:all");

      return newUser;
    },
  },
};
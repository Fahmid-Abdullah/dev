import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient();

async function main() {
    const User = await prisma.user.create({
        data: {
            email: "bob@gmail.com"
        }
    })

    console.log({ User })
}

main()
    .catch((err) => { console.log("Failed to create user.") })
    .finally(() => { prisma.$disconnect() });
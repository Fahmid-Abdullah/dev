import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
    const user =  await prisma.user.upsert({
        where: {
            email: "bob@gmail.com",
        },
        update: {},
        create: {
            email: "bob@gmail.com"
        }
    })
}

main()
    .catch((err) => console.log(err))
    .finally(() => prisma.$disconnect);
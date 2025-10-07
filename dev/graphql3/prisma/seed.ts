import prisma from "../lib/prisma"

async function main() {
    await prisma.user.create({
        data: {
            email: "test@gmail.com",
            firstName: "Test",
            lastName: "Test",
            password: "password",
            posts: {
                create: [
                    { title: "Example Post 1" },
                    { title: "Example Post 2" }
                ]
            }
        }
    })
}

main()
    .catch((err) => console.log(err))
    .finally(() => prisma.$disconnect);
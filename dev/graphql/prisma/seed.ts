import prisma from "../lib/prisma";

async function main() {
    const user = await prisma.user.create({
        data: {
            email: "bob@gmail.com",
            password: "password",
            posts: {
                create: [
                    { title: "Post 1" },
                    { title: "Post 2" },
                    { title: "Post 3" },
                ]
            }
        }
    })

    console.log(user);
}

main()
    .catch((err) => console.log(err))
    .finally(() => prisma.$disconnect);
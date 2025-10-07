import prisma from "../lib/prisma";

async function main() {
    const user = await prisma.user.create({
        data: 
            { email: "bob@gmail.com", password: "password", firstName: "Bob", lastName: "Bobblehead" }
    });
    console.log(user);
}

main()
    .catch((err) => { console.log(`Something went wrong. ${err}`) })
    .finally(() => prisma.$disconnect());
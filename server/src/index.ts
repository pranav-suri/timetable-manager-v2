import "source-map-support/register";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import "./express";

export const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

async function main() {
    await prisma.timetable.create({
        data: {
            name: "Timetable 1",
        },
    });

    // Inner Join,
    const a = await prisma.timetable.findFirst({
        where: {
            classrooms: {
                some: {},
            },
        },
    });

    const b = await prisma.timetable.findFirst();

    console.log(a);
    console.log(b);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        console.log("Error: Disconnecting Prisma Client");
        await prisma.$disconnect();
    });

export type { AppRouter } from "./trpc/appRouter";

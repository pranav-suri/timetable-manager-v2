import "source-map-support/register";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import "./express";

export const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

async function main() {
    const b = await prisma.timetable.create({
        data: {
            name: "Timetable 1",
        },
    });
    const a = await prisma.classroom.findFirst({
        include: {
            types: true,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        console.log("Error: Disconnecting Prisma Client");
        await prisma.$disconnect();
        process.exit(1);
    });

export type { AppRouter } from "./trpc/appRouter";

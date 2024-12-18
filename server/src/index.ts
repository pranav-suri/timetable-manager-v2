import "source-map-support/register";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import "./express";
import sampleDataUpload from "./controllers/sampleData";

export const prisma = new PrismaClient({
    // log: ["info", "warn", "error", "query"],
});

async function main() {
    // Create a new timetable if it doesn't exist
    await prisma.timetable.upsert({
        create: {
            id: 1,
            name: "Timetable 1",
        },
        update: {},
        where: {
            id: 1,
        },
    });

    // Inner Join,
    await prisma.timetable.findFirst({
        where: {
            classrooms: {
                some: {},
            },
        },
    });

    await prisma.timetable.findFirst();
    console.time(": Time taken for data upload");
    try {
        // await sampleDataUpload("ODD");
        // await sampleDataUpload("EVEN");
        return;
    } catch (e) {
        console.error(e);
    } finally {
        console.timeEnd(": Time taken for data upload");
    }
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

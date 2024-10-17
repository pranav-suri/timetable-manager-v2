import { prisma } from "..";
import { t } from "./main";
import z from "zod";

export const appRouter = t.router({
    teachers: t.procedure
        .input(z.object({ timetableId: z.number() }))
        .query(async () => {
            const teachers = await prisma.teacher.findMany();
            return { teachers };
        }),
    subjects: t.procedure
        .input(z.object({ timetableId: z.number() }))
        .query(async () => {
            const subjects = await prisma.subject.findMany();
            return { subjects };
        }),
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;

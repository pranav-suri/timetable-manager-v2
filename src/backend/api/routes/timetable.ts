import { Elysia, t } from "elysia";
import { getTimetable, getTTNested } from "../../controllers";

const app = new Elysia({ prefix: "timetable" })
    .get(
        "/divisionTimetable",
        async ({ query }) => {
            const { divisionId } = query;
            return { Timetable: await getTTNested(divisionId, "division") };
        },
        {
            query: t.Object({
                divisionId: t.Numeric(),
            }),
        },
    )
    .get(
        "/subdivisionTimetable",
        async ({ query }) => {
            const { subdivisionId } = query;
            return { Timetable: await getTTNested(subdivisionId, "subdivision") };
        },
        {
            query: t.Object({
                subdivisionId: t.Numeric(),
            }),
        },
    )
    .get(
        "/teacherTimetable",
        async ({ query }) => {
            const { teacherId } = query;
            return { Timetable: await getTTNested(teacherId, "teacher") };
        },
        {
            query: t.Object({
                teacherId: t.Numeric(),
            }),
        },
    )
    .get(
        "/classroomTimetable",
        async ({ query }) => {
            const { classroomId } = query;
            return { Timetable: await getTTNested(classroomId, "classroom") };
        },
        {
            query: t.Object({
                classroomId: t.Numeric(),
            }),
        },
    );

export default app;

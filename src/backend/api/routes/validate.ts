import { Elysia, t } from "elysia";
import { slotValidator, timetableValidator } from "../../controllers";
const app = new Elysia({ prefix: "/validate" })
    .get(
        "/teacherTT",
        async ({ query }) => {
            return await timetableValidator("teacher", query.teacherId);
        },
        {
            query: t.Object({
                teacherId: t.Numeric(),
            }),
            detail: {
                summary: "Validate teacher timetable complete",
                tags: ["Validate"],
            },
        },
    )
    .get(
        "/teacherTT/slot",
        async ({ query }) => {
            return await slotValidator(query.slotId, "teacher", query.teacherId);
        },
        {
            query: t.Object({
                slotId: t.Numeric(),
                teacherId: t.Numeric(),
            }),
            detail: {
                summary: "Validate teacher timetable slot",
                tags: ["Validate"],
            },
        },
    )
    .get(
        "/divisionTT",
        async ({ query }) => {
            return await timetableValidator("division", query.divisionId);
        },
        {
            query: t.Object({
                divisionId: t.Numeric(),
            }),
            detail: {
                summary: "Validate division timetable complete",
                tags: ["Validate"],
            },
        },
    )
    .get(
        "/divisionTT/slot",
        async ({ query }) => {
            return await slotValidator(query.slotId, "division", query.divisionId);
        },
        {
            query: t.Object({
                slotId: t.Numeric(),
                divisionId: t.Numeric(),
            }),
            detail: {
                summary: "Validate division timetable slot",
                tags: ["Validate"],
            },
        },
    )
    .get(
        "/subdivisionTT",
        async ({ query }) => {
            return await timetableValidator("subdivision", query.subdivisionId);
        },
        {
            query: t.Object({
                subdivisionId: t.Numeric(),
            }),
            detail: {
                summary: "Validate subdivision timetable complete",
                tags: ["Validate"],
            },
        },
    )
    .get(
        "/subdivisionTT/slot",
        async ({ query }) => {
            return await slotValidator(query.slotId, "subdivision", query.subdivisionId);
        },
        {
            query: t.Object({
                slotId: t.Numeric(),
                subdivisionId: t.Numeric(),
            }),
            detail: {
                summary: "Validate subdivision timetable slot",
                tags: ["Validate"],
            },
        },
    )
    .get(
        "/classroomTT",
        async ({ query }) => {
            return await timetableValidator("classroom", query.classroomId);
        },
        {
            query: t.Object({
                classroomId: t.Numeric(),
            }),
            detail: {
                summary: "Validate classroom timetable complete",
                tags: ["Validate"],
            },
        },
    )
    .get(
        "/classroomTT/slot",
        async ({ query }) => {
            return await slotValidator(query.slotId, "classroom", query.classroomId);
        },
        {
            query: t.Object({
                slotId: t.Numeric(),
                classroomId: t.Numeric(),
            }),
            detail: {
                summary: "Validate classroom timetable slot",
                tags: ["Validate"],
            },
        },
    );

export default app;

import { Elysia, t } from "elysia";
import { slotValidator, timetableValidator } from "../../controllers";
const app = new Elysia({ prefix: "validate" })
    .get(
        "/validateTeacherTT",
        async ({ query }) => {
            return await timetableValidator("teacher", query.teacherId);
        },
        {
            query: t.Object({
                teacherId: t.Numeric(),
            }),
        },
    )
    .get(
        "/validateTeacherTTSlot",
        async ({ query }) => {
            return await slotValidator(query.slotId, "teacher", query.teacherId);
        },
        {
            query: t.Object({
                slotId: t.Numeric(),
                teacherId: t.Numeric(),
            }),
        },
    )
    .get(
        "/validateDivisionTT",
        async ({ query }) => {
            return await timetableValidator("division", query.divisionId);
        },
        {
            query: t.Object({
                divisionId: t.Numeric(),
            }),
        },
    )
    .get(
        "/validateDivisionTTSlot",
        async ({ query }) => {
            return await slotValidator(query.slotId, "division", query.divisionId);
        },
        {
            query: t.Object({
                slotId: t.Numeric(),
                divisionId: t.Numeric(),
            }),
        },
    )
    .get(
        "/validateSubdivisionTT",
        async ({ query }) => {
            return await timetableValidator("subdivision", query.subdivisionId);
        },
        {
            query: t.Object({
                subdivisionId: t.Numeric(),
            }),
        },
    )
    .get(
        "/validateSubdivisionTTSlot",
        async ({ query }) => {
            return await slotValidator(query.slotId, "subdivision", query.subdivisionId);
        },
        {
            query: t.Object({
                slotId: t.Numeric(),
                subdivisionId: t.Numeric(),
            }),
        },
    )
    .get(
        "/validateClassroomTT",
        async ({ query }) => {
            return await timetableValidator("classroom", query.classroomId);
        },
        {
            query: t.Object({
                classroomId: t.Numeric(),
            }),
        },
    )
    .get(
        "/validateClassroomTTSlot",
        async ({ query }) => {
            return await slotValidator(query.slotId, "classroom", query.classroomId);
        },
        {
            query: t.Object({
                slotId: t.Numeric(),
                classroomId: t.Numeric(),
            }),
        },
    );

export default app;

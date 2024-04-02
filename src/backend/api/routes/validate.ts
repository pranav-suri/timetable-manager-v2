import { Elysia, t } from "elysia";
import { slotValidator, timetableValidator } from "../../controllers";
const app = new Elysia();
app.get(
    "/validateTeacherTT",
    async ({ query }) => {
        return await timetableValidator("teacher", query.teacherId);
    },
    {
        query: t.Object({
            teacherId: t.Numeric(),
        }),
    },
);

app.get(
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
);

app.get(
    "/validateDivisionTT",
    async ({ query }) => {
        return await timetableValidator("division", query.divisionId);
    },
    {
        query: t.Object({
            divisionId: t.Numeric(),
        }),
    },
);

app.get(
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
);

app.get(
    "/validateSubdivisionTT",
    async ({ query }) => {
        return await timetableValidator("subdivision", query.subdivisionId);
    },
    {
        query: t.Object({
            subdivisionId: t.Numeric(),
        }),
    },
);

app.get(
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
);

app.get(
    "/validateClassroomTT",
    async ({ query }) => {
        return await timetableValidator("classroom", query.classroomId);
    },
    {
        query: t.Object({
            classroomId: t.Numeric(),
        }),
    },
);

app.get(
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

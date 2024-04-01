import { Elysia } from "elysia";
import {
    deleteSlotData,
    addSlotData,
    addOrUpdateSlotData,
} from "../../controllers";
import { t } from "elysia";

const app = new Elysia();

app.delete("/deleteSlotData", async ({query}) => {
    //TODO: Return the deleted element 
    console.log(query);
    const { slotDataId } = query;
    await deleteSlotData(slotDataId);
    return;
}, {
    query: t.Object({
        slotDataId: t.Numeric(),
    }),
});

app.post("/addSlotData", async ({body}) => {
    const { slotId, subjectId, subdivisionIds, teacherId, classroomIds } = body;
    return await addSlotData(slotId, subjectId, teacherId, subdivisionIds, classroomIds);
}, {
    body: t.Object({
        slotId: t.Numeric(),
        subjectId: t.Numeric(),
        teacherId: t.Optional(t.Numeric()),
        subdivisionIds: t.Optional(t.Array(t.Numeric())),
        classroomIds: t.Optional(t.Array(t.Numeric())),
    }),

});

app.put("/addOrUpdateSlotData", async ({body}) => {
    const { oldSlotDataId, slotId, subjectId, subdivisionIds, teacherId, classroomIds } = body;
    return await addOrUpdateSlotData(
        oldSlotDataId,
        slotId,
        subjectId,
        teacherId,
        subdivisionIds,
        classroomIds,
    );
}, {
    body: t.Object({
        oldSlotDataId: t.Numeric(),
        slotId: t.Numeric(),
        subjectId: t.Numeric(),
        teacherId: t.Optional(t.Numeric()),
        subdivisionIds: t.Optional(t.Array(t.Numeric())),
        classroomIds: t.Optional(t.Array(t.Numeric())),
    }),
});

export default app;

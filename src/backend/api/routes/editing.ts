import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import {
    deleteSlotData,
    addSlotData,
    addOrUpdateSlotData,
} from "../../controllers";

const app = new Elysia();
app.use(cors({ methods: ["GET", "POST"] }));

app.delete("/deleteSlotData", async (req) => {
    //TODO: Return the deleted element 
    console.log(req.body);
    const { slotDataId } = req.body;
    if (!slotDataId) {
        req.set.status = 400;
        return { error: { message: "slotDataId is required." } };
    }
    await deleteSlotData(slotDataId);
    return;
});

app.post("/addSlotData", async (req) => {
    const { slotId, subjectId, subdivisionIds, teacherId, classroomIds } = req.body;
    if (!slotId || !subjectId) {
        req.set.status = 400;
        return { error: { message: "slotId and subjectId is required." } };
    }
    return await addSlotData(slotId, subjectId, teacherId, subdivisionIds, classroomIds);
});

app.put("/addOrUpdateSlotData", async (req) => {
    const { oldSlotDataId, slotId, subjectId, subdivisionIds, teacherId, classroomIds } = req.body;
    if (!slotId || !subjectId) {
        req.set.status = 400;
        return { error: { message: "slotId and subjectId is required." } };
    }
    return await addOrUpdateSlotData(
        oldSlotDataId,
        slotId,
        subjectId,
        teacherId,
        subdivisionIds,
        classroomIds,
    );
});

export default app;

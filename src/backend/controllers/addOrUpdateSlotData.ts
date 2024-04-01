import deleteSlotData from "./deleteSlotData";
import createSlotData from "./addSlotData";
// Please test @Mahajan

async function addOrUpdateSlotData(
    oldSlotDataId: number | null,
    slotId: number,
    subjectId: number,
    teacherId?: number,
    subdivisionIds?: number[],
    classroomIds?: number[],
) {
    if (oldSlotDataId) await deleteSlotData(oldSlotDataId);
    return await createSlotData(slotId, subjectId, teacherId, subdivisionIds, classroomIds);
}

export default addOrUpdateSlotData;

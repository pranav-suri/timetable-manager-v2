import deleteSlotData from "./deleteSlotData";
import createSlotData from "./addSlotData";
// Please test @Mahajan

async function addOrUpdateSlotData(
    oldSlotDataId: number | null,
    slotId: number,
    subjectId: number,
    teacherId: number | null = null,
    subdivisionIds: number[] | null = null,
    classroomIds: number[] | null = null,
) {
    if (oldSlotDataId) await deleteSlotData(oldSlotDataId);
    return await createSlotData(slotId, subjectId, teacherId, subdivisionIds, classroomIds);
}

export default addOrUpdateSlotData;

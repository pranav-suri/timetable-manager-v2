import addSlotData from "./addSlotData";
import deleteSlotData from "./deleteSlotData";

async function updateSlotData(
    slotDataId: number | null,
    slotId: number,
    subjectId: number | null,
    teacherId: number | null,
    subdivisionIds: number[],
    classroomIds: number[],
) {
    if (slotDataId) await deleteSlotData(slotDataId);

    return await addSlotData(slotId, subjectId, teacherId, subdivisionIds, classroomIds);
}

export default updateSlotData;

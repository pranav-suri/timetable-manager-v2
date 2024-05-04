import { SlotDataClasses, SlotDataSubdivisions, SlotDatas } from "../database";
import addSlotData from "./addSlotData";
import { addSlotDataClassesAndSubdivs } from "./addSlotDataClassesAndSubdivs";
import deleteSlotData from "./deleteSlotData";

async function updateSlotData(
    slotDataId: number | null,
    slotId: number,
    subjectId: number,
    teacherId: number | null,
    subdivisionIds: number[],
    classroomIds: number[],
) {
    if (slotDataId) 
        await deleteSlotData(slotDataId);
    
    return await addSlotData(slotId, subjectId, teacherId, subdivisionIds, classroomIds);
}

export default updateSlotData;


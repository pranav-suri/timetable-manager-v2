import { SlotDatas } from "../database";
import { addSlotDataClassesAndSubdivs } from "./addSlotDataClassesAndSubdivs";

async function addSlotData(
    slotId: number,
    subjectId: number | null,
    teacherId: number | null,
    subdivisionIds: number[],
    classroomIds: number[],
) {
    const [slotData] = await SlotDatas.findOrCreate({
        where: { SubjectId: subjectId, SlotId: slotId, TeacherId: teacherId },
    });

    await addSlotDataClassesAndSubdivs(slotData.id, subdivisionIds, classroomIds);
    return slotData;
}

export default addSlotData;

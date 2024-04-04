import { SlotDatas, SlotDataClasses, SlotDataSubdivisions } from "../database";
import { addSlotDataClassesAndSubdivs } from "./addSlotDataClassesAndSubdivs";

async function addSlotData(
    slotId: number,
    subjectId: number,
    teacherId?: number | null,
    subdivisionIds?: number[],
    classroomIds?: number[],
) {
    const whereTeacherClause = teacherId ? { TeacherId: teacherId } : {teacherId: null};

    const [slotData] = await SlotDatas.findOrCreate({
        where: { SubjectId: subjectId, SlotId: slotId, ...whereTeacherClause },
    });

    await addSlotDataClassesAndSubdivs(slotData.id, subdivisionIds, classroomIds);
    return slotData;
}

export default addSlotData;
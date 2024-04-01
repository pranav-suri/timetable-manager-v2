import { SlotDatas, SlotDataClasses, SlotDataSubdivisions } from "../database";

async function addSlotData(
    slotId: number,
    subjectId: number,
    teacherId?: number,
    subdivisionIds?: number[],
    classroomIds?: number[],
) {
    const whereTeacherClause = teacherId ? { TeacherId: teacherId } : {};

    const [slotData] = await SlotDatas.findOrCreate({
        where: { SubjectId: subjectId, SlotId: slotId, ...whereTeacherClause },
    });

    if (subdivisionIds) {
        for (const subdivisionId of subdivisionIds) {
            await SlotDataSubdivisions.findOrCreate({
                where: { SlotDataId: slotData.id, SubdivisionId: subdivisionId },
            });
        }
    }
    if (classroomIds) {
        for (const classroomId of classroomIds) {
            await SlotDataClasses.findOrCreate({
                where: { SlotDataId: slotData.id, ClassroomId: classroomId },
            });
        }
    }
    return slotData;
}

export default addSlotData;
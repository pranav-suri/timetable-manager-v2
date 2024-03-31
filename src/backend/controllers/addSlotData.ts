import { SlotDatas, SlotDataClasses, SlotDataSubdivisions } from "../database";

async function addSlotData(
    slotId: number,
    subjectId: number,
    teacherId: number | null = null,
    subdivisionIds: number[] | null = null,
    classroomIds: number[] | null = null,
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
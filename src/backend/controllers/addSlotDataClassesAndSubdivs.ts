import { SlotDataClasses, SlotDataSubdivisions } from "../database";

export async function addSlotDataClassesAndSubdivs(
    slotDataId: number,
    subdivisionIds?: number[],
    classroomIds?: number[],
) {
    if (subdivisionIds) {
        for (const subdivisionId of subdivisionIds) {
            await SlotDataSubdivisions.findOrCreate({
                where: { SlotDataId: slotDataId, SubdivisionId: subdivisionId },
            });
        }
    }
    if (classroomIds) {
        for (const classroomId of classroomIds) {
            await SlotDataClasses.findOrCreate({
                where: { SlotDataId: slotDataId, ClassroomId: classroomId },
            });
        }
    }
}

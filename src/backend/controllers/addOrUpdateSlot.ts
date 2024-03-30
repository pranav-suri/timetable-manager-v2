import { SlotDatas, SlotDataClasses } from "../database";
// Please test @Mahajan

async function addOrUpdateSlot(
    oldSlotDataIds: string[] | number[],
    slotId: number,
    subdivisionIds: number[],
    subjectId: number,
    teacherId: number,
    classroomIds: number[]
) {
    if (oldSlotDataIds) {
        await SlotDatas.destroy({
            where: {
                id: oldSlotDataIds,
            },
        });
    }
    for (const subdivisionId of subdivisionIds) {
        const slotData = await SlotDatas.create({
            SubdivisionId: subdivisionId,
            SubjectId: subjectId,
            TeacherId: teacherId,
            SlotId: slotId,
        });

        for (const classroomId of classroomIds) {
            const slotDataClasses = await SlotDataClasses.create({
                SlotDataId: slotData.id,
                ClassroomId: classroomId,
            });
        }
    }
}

export default addOrUpdateSlot;

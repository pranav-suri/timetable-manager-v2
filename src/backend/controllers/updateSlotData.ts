import { SlotDataClasses, SlotDataSubdivisions, SlotDatas } from "../database";
import { addSlotDataClassesAndSubdivs } from "./addSlotDataClassesAndSubdivs";

async function updateSlotData(
    slotDataId: number,
    slotId: number,
    subjectId: number,
    teacherId?: number | null,
    subdivisionIds?: number[],
    classroomIds?: number[],
) {
    if (!teacherId) teacherId = null;
    await SlotDatas.update(
        { SlotId: slotId, SubjectId: subjectId, TeacherId: teacherId },
        { where: { id: slotDataId } },
    );
    await SlotDataClasses.destroy({
        where: {
            SlotDataId: slotDataId,
        },
    });
    await SlotDataSubdivisions.destroy({
        where: {
            SlotDataId: slotDataId,
        },
    });

    await addSlotDataClassesAndSubdivs(slotDataId, subdivisionIds, classroomIds);
}

export default updateSlotData;


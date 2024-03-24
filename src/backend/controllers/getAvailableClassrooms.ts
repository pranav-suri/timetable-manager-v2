import { Classroom, SlotData, SlotDataClasses, Subject, Teacher } from "../database";

async function getAvailableClassrooms(slotId: string | number, subjectId: string | number) {
    const testP = await Subject.findByPk(subjectId);
    const labsOrClasses = await Classroom.findAll({
        where: { isLab: (await Subject.findByPk(subjectId))?.isLab },
    });

    const slotDatas = await SlotData.findAll({
        where: { SlotId: slotId },
    });

    const slotDataIds = slotDatas.map((slotData) => slotData.id);
    console.log("Slot Data Ids: " + slotDataIds);

    const slotDataClasses = await SlotDataClasses.findAll({
        where: { SlotDataId: slotDataIds },
    });
    
    const inUse = slotDataClasses.map((slotDataClass) => slotDataClass.ClassroomId);
    const inUseDistinct = [...new Set(inUse)];

    console.log("inUse ids: "+ inUseDistinct);
    const classesInUse = await Classroom.findAll({
        where: { id: inUseDistinct },
    });

    const availableClassrooms = labsOrClasses.filter(
        (labOrClass) => !classesInUse.some((classesInUse) => classesInUse.id === labOrClass.id)
    );

    return availableClassrooms;
}

export default getAvailableClassrooms;

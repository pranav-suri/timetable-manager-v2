import { Subject, Teacher } from "../database";
import {getSubjectTeachers} from "./";

async function getAvailableTeachers(slotId: number, subjectId: number) {
    const subjectTeachers = await getSubjectTeachers(subjectId);
    const subject = await Subject.findByPk(subjectId);
    console.log(subject?.toJSON())
    // Busy teachers in the given slot
    const busyTeachers = await Teacher.findAll({
        include: [
            {
                association: "SlotDatas",
                where: { slotId: slotId, subjectId: subjectId},
                required: true,
                include: [{
                    association: "SlotDataSubdivisions",
                    required: true,
                    attributes: [],
                }]
            },
        ],
    });
    const availableSubjectTeachers = subjectTeachers.filter(
        (subjectTeacher) => !busyTeachers.some((teacher) => teacher.id === subjectTeacher.id)
    );
    console.log(busyTeachers.length)
    console.log(availableSubjectTeachers.length)

    return availableSubjectTeachers;
}

await getAvailableTeachers(21, 1)

export default getAvailableTeachers;

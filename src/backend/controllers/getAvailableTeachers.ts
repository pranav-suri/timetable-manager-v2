import { Json } from "sequelize/lib/utils";
import { Teacher } from "../database";
import getAllTeachers from "./getAllTeachers";

async function getAvailableTeachers(slotId: string | number, subjectId: string | number) {
    const subjectTeachers = await getAllTeachers(subjectId);
    console.log(JSON.stringify(subjectTeachers));

    const teachers = await Teacher.findAll({
        include: [
            {
                association: "SlotData",
                where: { slotId: slotId },
            },
        ],
    });

    console.log(JSON.stringify(teachers));
    // add subtraction logic
    const availableTeachers = subjectTeachers.filter(
        (subjectTeacher) => !teachers.some((teacher) => teacher.id === subjectTeacher.id)
    );
    console.log(JSON.stringify(availableTeachers));
    return availableTeachers;
}

export default getAvailableTeachers;

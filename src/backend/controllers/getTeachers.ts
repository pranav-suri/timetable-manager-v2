import { Teacher, Teach } from "../database"; // Assuming you have defined Teacher and Teach models

async function getTeachers(subjectId: string | number) {
    const teachers = await Teacher.findAll({
        include: [
            {
                association: "Teach",
                where: { subjectId: subjectId },
            },
        ],
    });
    return teachers;
}

export default getTeachers;

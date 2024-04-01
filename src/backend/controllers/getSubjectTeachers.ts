import { Teacher } from "../database"; // Assuming you have defined Teacher and Teach models

async function getSubjectTeachers(subjectId: number) {
    const teachers = await Teacher.findAll({
        include: [
            {
                association: "Teach",
                where: { SubjectId: subjectId },
            },
        ],
    });
    return teachers;
}

export default getSubjectTeachers;

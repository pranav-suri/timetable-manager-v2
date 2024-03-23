import { Teacher } from "../database"; // Assuming you have defined Teacher and Teach models

async function getAllTeachers(subjectId: string | number) {
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

export default getAllTeachers;

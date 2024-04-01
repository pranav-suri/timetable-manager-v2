import { Subject } from "../database";

async function getSubjects(departmentId: number) {
    const subjects = await Subject.findAll({
        where: {
            DepartmentId: departmentId,
        },
    });
    return subjects;
}

export default getSubjects;

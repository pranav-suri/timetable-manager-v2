import { Subject } from "../database";

async function getSubjects(departmentId: string | number) {
    const result = await Subject.findAll({
        where: {
            DepartmentId: departmentId,
        },
    });
}

export default getSubjects;

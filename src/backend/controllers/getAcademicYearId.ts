import { AcademicYear } from "../database";

export default async function getAcademicYearId(
    searchBy: "subdivision" | "teacher" | "classroom" | "division" | "slot" | "department",
    searchId: number,
): Promise<AcademicYear["id"]> {
    let associationQuery = {};
    switch (searchBy) {
        case "division":
            associationQuery = {
                association: "Batch",
                include: [
                    {
                        association: "Department",
                        include: [
                            {
                                association: "Division",
                                where: { id: searchId },
                                required: true,
                            },
                        ],
                    },
                ],
            };
            break;
        case "subdivision":
            associationQuery = {
                association: "Batch",
                include: [
                    {
                        association: "Department",
                        include: [
                            {
                                association: "Division",
                                include: [
                                    {
                                        association: "Subdivision",
                                        where: { id: searchId },
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            break;
        case "teacher":
            associationQuery = {
                association: "Teacher",
                where: { id: searchId },
                required: true,
            };
            break;
        case "classroom":
            associationQuery = {
                association: "Classroom",
                where: { id: searchId },
                required: true,
            };
            break;
        case "slot":
            associationQuery = {
                association: "Slot",
                where: { id: searchId },
                required: true,
            };
            break;
        case "department":
            associationQuery = {
                association: "Batch",
                include: [
                    {
                        association: "Department",
                        where: { id: searchId },
                        required: true,
                    },
                ],
            };
            break;
        default:
            throw new Error(`Unhandled case in getAcademicYearId function: ${searchBy}`);
    }

    const academicYear = await AcademicYear.findOne({
        rejectOnEmpty: true,
        include: [associationQuery],
    });

    // if (academicYear)
    return academicYear.id;
}

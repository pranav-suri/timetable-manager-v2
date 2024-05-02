import { AcademicYear, Slot, SlotDataSubdivisions, SlotDatas, Subdivision } from "../database";

async function getAcademicYearId(
    searchBy: "subdivision" | "teacher" | "classroom" | "division" | "slot",
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
export default getAcademicYearId;

// The following code is the old version of the function with the same functionality.
async function getAcademicYearId_old(
    searchId: string | number,
    searchBy: "subdivision" | "teacher" | "classroom" | "division",
) {
    let academicYear;
    switch (searchBy) {
        case "division":
            academicYear = await AcademicYear.findOne({
                include: [
                    {
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
                    },
                ],
            });
            break;
        case "subdivision":
            academicYear = await AcademicYear.findOne({
                include: [
                    {
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
                    },
                ],
            });
            break;
        case "teacher":
            academicYear = await AcademicYear.findOne({
                include: [
                    {
                        association: "Teacher",
                        where: { id: searchId },
                        required: true,
                    },
                ],
            });
            break;
        case "classroom":
            academicYear = await AcademicYear.findOne({
                include: [
                    {
                        association: "Classroom",
                        where: { id: searchId },
                        required: true,
                    },
                ],
            });
            break;
        default:
            throw new Error(`Unhandled case in getAcademicYearId function. ${searchBy}`);
    }
    if (academicYear) {
        return academicYear.id;
    }
}

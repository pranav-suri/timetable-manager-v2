import { AcademicYear, Slot } from "../database";
async function getAcademicYearId(
    searchId: string | number,
    searchBy: "subdivision" | "teacher" | "classroom",
) {
    let academicYear;
    switch (searchBy) {
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
            throw new Error("Unhandled case in getAcademicYearId function.");
    }
    if (academicYear) {
        return academicYear.id;
    }
}
async function getTimetable(
    searchId: string | number,
    searchBy: "subdivision" | "teacher" | "classroom",
) {
    const searchByColumnMap = {
        subdivision: "SubdivisionId",
        teacher: "TeacherId",
        classroom: "ClassroomId",
    };
    const searchColumn = searchByColumnMap[searchBy];

    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(searchId, searchBy),
        },
        include: [
            {
                association: "SlotData",
                required: false,
                where: {
                    [searchColumn]: searchId,
                },
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "Subdivision",
                        include: ["Division"],
                    },
                    {
                        association: "SlotDataClasses",
                        include: [
                            {
                                association: "Classroom",
                            },
                        ],
                    },
                ],
            },
        ],
    });
    return { Slots: slotsWithData };
}

export default getTimetable;

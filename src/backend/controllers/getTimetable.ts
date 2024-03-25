import { Slot } from "../database";
async function getTimetable(
    academicYearId: string | number,
    searchId: string | number,
    searchBy: "subdivision" | "teacher" | "classroom"
) {
    const searchByColumnMap = {
        subdivision: "SubdivisionId",
        teacher: "TeacherId",
        classroom: "ClassroomId",
    };
    const searchColumn = searchByColumnMap[searchBy];

    const result = await Slot.findAll({
        order: [["day", "ASC"], ["number", "ASC"]],
        where: {
            AcademicYearId: academicYearId,
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
    return { Slots: result };
}

export default getTimetable;

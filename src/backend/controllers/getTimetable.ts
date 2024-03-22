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
    const column = searchByColumnMap[searchBy];

    const result = await Slot.findAll({
        where: {
            AcademicYearId: academicYearId,
        },
        include: [
            {
                association: "SlotData",
                required: false,
                where: {
                    [column]: searchId,
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

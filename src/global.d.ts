// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createModal(text: string): void;

interface TimetableStructure {
    Timetable: {
        Slots: [
            {
                id: number;
                day: number;
                number: number;
                AcademicYearId: number;
                SlotDatas: [
                    {
                        id: number;
                        Teacher: {
                            id: number;
                            teacherName: string;
                            teacherEmail: string;
                        };
                        Subject: {
                            id: number;
                            isLab: boolean;
                            subjectName: string;
                        };

                        SlotDataSubdivisions: [
                            {
                                id: number;
                                Subdivision: {
                                    id: number;
                                    subdivisionName: string;
                                };
                            },
                        ];
                        SlotDataClasses: [
                            {
                                id: number;
                                Classroom: {
                                    id: number;
                                    classroomName: string;
                                    isLab: boolean;
                                };
                            },
                        ];
                    },
                ];
            },
        ];
    };
}
type Timetable = TimetableStructure["Timetable"];
type Slots = Timetable["Slots"];
type SlotDatas = Slots[0]["SlotDatas"];
type SlotDataClasses = SlotDatas[0]["SlotDataClasses"];
type SlotDataSubdivisions = SlotDatas[0]["SlotDataSubdivisions"];

type AcademicYear = {
    id: number;
    year: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

type AcademicYears = {
    academicYears: AcademicYear[];
};

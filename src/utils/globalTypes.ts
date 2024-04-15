import { AcademicYear as DBAcademicYear } from "../backend/database";
import { InferAttributes } from "sequelize";

declare global {
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
}

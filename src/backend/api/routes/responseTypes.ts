import { InferAttributes } from "sequelize";
import {
    AcademicYear,
    Batch,
    Classroom,
    Department,
    Division,
    Slot,
    Subdivision,
    Subject,
    Teacher,
} from "../../database";
import { getTimetable } from "../../controllers";

export type AcademicYearResponse = {
    academicYears: InferAttributes<AcademicYear, { omit: never }>[];
};

export type TeacherResponse = {
    teachers: InferAttributes<Teacher, { omit: never }>[];
};

export type ClassroomResponse = {
    classrooms: InferAttributes<Classroom, { omit: never }>[];
};

export type SubjectResponse = {
    subjects: InferAttributes<Subject, { omit: never }>[];
};

export type BatchResponse = {
    batches: InferAttributes<Batch, { omit: never }>[];
};

export type SubdivisionResponse = {
    subdivisions: InferAttributes<Subdivision, { omit: never }>[];
};

export type TimetableResponse = {
    timetable: {
        slots: InferAttributes<Slot, { omit: never }>[];
    };
};

export type DepartmentResponse = {
    departments: InferAttributes<Department, { omit: never }>[];
};

export type DivisionResponse = {
    divisions: InferAttributes<Division, { omit: never }>[];
};
export type TimetableUnnestedResponse = {
    timetable: Awaited<ReturnType<typeof getTimetable>>;
};

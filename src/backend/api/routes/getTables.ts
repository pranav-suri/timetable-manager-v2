import { Elysia, t } from "elysia";
import {
    AcademicYear,
    Batch,
    Classroom,
    Department,
    Division,
    Subdivision,
    Subject,
    Teacher,
} from "../../database";
import { getSubjectTeachers, getTTNested } from "../../controllers";
import {
    AcademicYearResponse,
    ClassroomResponse,
    TeacherResponse,
    BatchResponse,
    SubdivisionResponse,
    SubjectResponse,
    TimetableResponse,
    DepartmentResponse,
    DivisionResponse,
} from "./responseTypes";

const app = new Elysia()
    .get(
        "/academicYears",
        async () => {
            return {
                academicYears: await AcademicYear.findAll(),
            } as AcademicYearResponse; // TODO: #5 @pranav-suri Add userId function once User is implemented
        },
        {
            detail: {
                summary: "Get all academic years",
                tags: ["Academic Years"],
            },
        },
    )
    .get(
        "/academicYears/:id/teachers",
        async ({ params }) => {
            const { id } = params;
            return {
                teachers: await Teacher.findAll({
                    where: {
                        AcademicYearId: id,
                    },
                }),
            } as TeacherResponse;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get teachers of an academic year",
                tags: ["Teachers"],
            },
        },
    )
    .get(
        "/academicYears/:id/classrooms",
        async ({ params }) => {
            const { id } = params;
            return {
                classrooms: await Classroom.findAll({ where: { AcademicYearId: id } }),
            } as ClassroomResponse;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get classrooms of an academic year",
                tags: ["Classrooms"],
            },
        },
    )
    .get(
        "/academicYears/:id/batches",
        async ({ params }) => {
            const { id } = params;
            return {
                batches: await Batch.findAll({
                    where: {
                        AcademicYearId: id,
                    },
                }),
            } as BatchResponse;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get batches of an academic year",
                tags: ["Batches"],
            },
        },
    )
    .get(
        "/batches/:id/departments",
        async ({ params }) => {
            const { id } = params;
            return {
                departments: await Department.findAll({
                    where: {
                        BatchId: id,
                    },
                }),
            } as DepartmentResponse;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get departments of a batch",
                tags: ["Departments"],
            },
        },
    )
    .get(
        "/departments/:id/subjects",
        async ({ params }) => {
            const { id } = params;
            return {
                subjects: await Subject.findAll({
                    where: {
                        DepartmentId: id, // TODO: add multi disc sub
                    },
                }),
            } as SubjectResponse;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get subjects of a department",
                tags: ["Subjects"],
            },
        },
    )
    .get(
        "/departments/:id/divisions",
        async ({ params }) => {
            const { id } = params;
            return {
                divisions: await Division.findAll({
                    where: {
                        DepartmentId: id,
                    },
                }),
            } as DivisionResponse;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get divisions of a department",
                tags: ["Divisions"],
            },
        },
    )
    .get(
        "/divisions/:id/subdivisions",
        async ({ params }) => {
            const { id } = params;
            return {
                subdivisions: await Subdivision.findAll({
                    where: {
                        DivisionId: id,
                    },
                }),
            } as SubdivisionResponse;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get subdivisions of a division",
                tags: ["Subdivisions"],
            },
        },
    )
    .get(
        "/:timetableSearchBy/:id/timetable",
        async ({ params }) => {
            const timetableSearchTypes = [
                "division",
                "subdivision",
                "teacher",
                "classroom",
            ] as const;
            const { timetableSearchBy, id } = params;
            if (!timetableSearchTypes.includes(timetableSearchBy)) {
                throw new Error("Invalid search type");
            }
            const { slots } = await getTTNested(id, timetableSearchBy);
            return { timetable: { slots } } as TimetableResponse;
        },
        {
            params: t.Object({
                timetableSearchBy: t.Enum({
                    divisions: "division",
                    subdivisions: "subdivision",
                    teachers: "teacher",
                    classrooms: "classroom",
                } as const),
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get timetable of a search type",
                tags: ["Timetable"],
            },
        },
    )
    // .get(
    //     "/divisions/:id/timetable",
    //     async ({ params }) => {
    //         const { id } = params;
    //         return { timetable: await getTTNested(id, "division") } as TimetableResponse;
    //     },
    //     {
    //         params: t.Object({
    //             id: t.Numeric(),
    //         }),
    //         detail: {
    //             summary: "Get timetable of a division",
    //             tags: ["Timetable"],
    //         },
    //     },
    // )
    // .get(
    //     "/subdivisions/:id/timetable",
    //     async ({ params }) => {
    //         const { id } = params;
    //         return { timetable: await getTTNested(id, "subdivision") } as TimetableResponse;
    //     },
    //     {
    //         params: t.Object({
    //             id: t.Numeric(),
    //         }),
    //         detail: {
    //             summary: "Get timetable of a subdivision",
    //             tags: ["Timetable"],
    //         },
    //     },
    // )
    // .get(
    //     "/teachers/:id/timetable",
    //     async ({ params }) => {
    //         const { id } = params;
    //         return { timetable: await getTTNested(id, "teacher") } as TimetableResponse;
    //     },
    //     {
    //         params: t.Object({
    //             id: t.Numeric(),
    //         }),
    //         detail: {
    //             summary: "Get timetable of a teacher",
    //             tags: ["Timetable"],
    //         },
    //     },
    // )
    // .get(
    //     "/classrooms/:id/timetable",
    //     async ({ params }) => {
    //         const { id } = params;
    //         return { timetable: await getTTNested(id, "classroom") };
    //     },
    //     {
    //         params: t.Object({
    //             id: t.Numeric(),
    //         }),
    //         detail: {
    //             summary: "Get timetable of a classroom",
    //             tags: ["Timetable"],
    //         },
    //     },
    // )
    .get(
        "/subjects/:id/teachers",
        async ({ params }) => {
            const { id } = params;
            return { teachers: await getSubjectTeachers(id) };
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get teachers of a subject",
                tags: ["Teachers"],
            },
        },
    );

export default app;

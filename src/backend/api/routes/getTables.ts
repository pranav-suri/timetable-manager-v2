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

const app = new Elysia()
    .get(
        "/academicYears",
        async () => {
            return { academicYears: await AcademicYear.findAll() }; // TODO: add userId function
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
            };
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
            };
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
            };
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
        "batches/:id/departments",
        async ({ params }) => {
            const { id } = params;
            return {
                departments: await Department.findAll({
                    where: {
                        BatchId: id,
                    },
                }),
            };
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
            };
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
            };
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
        "divisions/:id/subdivisions",
        async ({ params }) => {
            const { id } = params;
            return {
                subdivisions: await Subdivision.findAll({
                    where: {
                        DivisionId: id,
                    },
                }),
            };
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
        "/divisions/:id/timetable",
        async ({ params }) => {
            const { id } = params;
            return { Timetable: await getTTNested(id, "division") };
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get timetable of a division",
                tags: ["Timetable"],
            },
        },
    )
    .get(
        "/subdivisions/:id/timetable",
        async ({ params }) => {
            const { id } = params;
            return { Timetable: await getTTNested(id, "subdivision") };
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get timetable of a subdivision",
                tags: ["Timetable"],
            },
        },
    )
    .get(
        "/teachers/:id/timetable",
        async ({ params }) => {
            const { id } = params;
            return { Timetable: await getTTNested(id, "teacher") };
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get timetable of a teacher",
                tags: ["Timetable"],
            },
        },
    )
    .get(
        "/classrooms/:id/timetable",
        async ({ params }) => {
            const { id } = params;
            return { Timetable: await getTTNested(id, "classroom") };
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Get timetable of a classroom",
                tags: ["Timetable"],
            },
        },
    )
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
export type GetTables = typeof app;

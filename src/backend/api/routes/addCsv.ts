import { Elysia } from "elysia";
import { t } from "elysia";
import {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadSubjectAndTeacherData,
} from "../upload/dataUpload";

const baseDir = "/";

const app = new Elysia({ prefix: "/csv" })
    .post(
        "/subjectAndTeachers",
        async ({ body }) => {
            uploadSubjectAndTeacherData(await body.file.text(), body.academicYearId);
        },
        {
            body: t.Object({
                file: t.File(),
                academicYearId: t.Numeric(),
            }),
            detail: {
                summary: "Uploading subject and teachers csv",
                tags: ["CSV"],
            },
        },
    )
    .post(
        "/classrooms",
        async (ctx) => {
            // console.log(ctx.body);
            const body = ctx.body;

            uploadClassroomData(await body.file.text(), body.academicYearId);
        },
        {
            body: t.Object({
                file: t.File(),
                academicYearId: t.Numeric(),
            }),
            detail: {
                summary: "Uploading classroom csv",
                tags: ["CSV"],
            },
        },
    )
    .post(
        "/batchAndSubdivisions",
        async (ctx) => {
            // console.log(ctx.body);
            const body = ctx.body;
            // console.log(body.academicYearId);

            uploadBatchAndSubdivsionData(await body.file.text(), await body.academicYearId);
            // console.log(await ctx.body.file.text())
        },
        {
            body: t.Object({
                file: t.File(),
                academicYearId: t.Numeric(),
            }),
            detail: {
                summary: "Uploading batch and subdivisions csv",
                tags: ["CSV"],
            },
        },
    )
    .listen(3000);

export default app;

import { Elysia } from "elysia";
import { t } from "elysia";
import * as nanoid from "nanoid";
import {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadSubjectAndTeacherData,
} from "../upload/dataUpload";

const baseDir = "/";

const app = new Elysia({ prefix: "/csv" })
    .post(
        "/subjectAndTeachers",
        async ({body}) => {
            // console.log(body);
            // console.log(body.academicYearId);

            uploadSubjectAndTeacherData(await body.file.text(), body.academicYearId);
            // console.log(await body.file.text())
        },
        {
            body: t.Object({
                file: t.File(),
                academicYearId: t.Numeric(),
            }),
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
        },
    )
    .listen(3000);

export default app;

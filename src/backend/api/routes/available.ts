import { Elysia, t } from "elysia";
import { getAvailableClassrooms, getAvailableTeachers } from "../../controllers";

const app = new Elysia({ prefix: "/available" })
    .get(
        "/teachers",
        async ({ query }) => {
            const { subjectId, slotId } = query;
            return { teachers: await getAvailableTeachers(slotId, subjectId) };
        },
        {
            query: t.Object({
                subjectId: t.Numeric(),
                slotId: t.Numeric(),
            }),
            detail: {
                summary: "Get available teachers",
                tags: ["Teachers"],
            },
            // response: t.Object({
            //     teachers: t.Array(
            //         t.Object({
            //             id: t.Numeric(),
            //             teacherName: t.String(),
            //         }),
            //     ),
            // }),
        },
    )
    .get(
        "/classrooms",
        async ({ query }) => {
            const { subjectId, slotId } = query;
            return { classrooms: await getAvailableClassrooms(slotId, subjectId) };
        },
        {
            query: t.Object({
                subjectId: t.Numeric(),
                slotId: t.Numeric(),
            }),
            detail: {
                summary: "Get available classrooms",
                tags: ["Classrooms"],
            },
        },
    );
export default app;

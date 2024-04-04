import { Elysia } from "elysia";
import { deleteSlotData, addSlotData, updateSlotData } from "../../controllers";
import { t } from "elysia";

const app = new Elysia({ prefix: "/slotDatas" })
    .post(
        "/",
        async ({ body }) => {
            const { slotId, subjectId, subdivisionIds, teacherId, classroomIds } = body;
            return await addSlotData(slotId, subjectId, teacherId, subdivisionIds, classroomIds);
        },
        {
            body: t.Object({
                slotId: t.Numeric(),
                subjectId: t.Numeric(),
                teacherId: t.Optional(t.Numeric()),
                subdivisionIds: t.Optional(t.Array(t.Numeric())),
                classroomIds: t.Optional(t.Array(t.Numeric())),
            }),
            detail: {
                summary: "Add slot data",
                tags: ["Slot Datas"],
            },
        },
    )
    .delete(
        "/:id",
        async ({ params }) => {
            //TODO: Return the deleted element
            console.log(params);
            const { id } = params;
            await deleteSlotData(id);
            return;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Delete slot data",
                tags: ["Slot Datas"],
            },
        },
    )
    .put(
        "/:id",
        async ({ body, params }) => {
            const { id } = params;
            const { slotId, subjectId, subdivisionIds, teacherId, classroomIds } = body;
            return await updateSlotData(
                id,
                subjectId,
                teacherId,
                subdivisionIds,
                classroomIds,
            );
        },
        {
            body: t.Object({
                slotId: t.Numeric(),
                subjectId: t.Numeric(),
                teacherId: t.Optional(t.Numeric()),
                subdivisionIds: t.Optional(t.Array(t.Numeric())),
                classroomIds: t.Optional(t.Array(t.Numeric())),
            }),
            params: t.Object({
                id: t.Numeric(),
            }),
            detail: {
                summary: "Update slot data",
                tags: ["Slot Datas"],
            },
        },
    );

export default app;

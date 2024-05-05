import { Elysia } from "elysia";
import { deleteSlotData, updateSlotData } from "../../controllers";
import { t } from "elysia";

const app = new Elysia({ prefix: "/slotDatas" })
    .post(
        "/update",
        async ({ body }) => {
            const { slotDataId, slotId, subjectId, subdivisionIds, teacherId, classroomIds } = body;
            return {
                slotData: await updateSlotData(
                    slotDataId,
                    slotId,
                    subjectId,
                    teacherId,
                    subdivisionIds,
                    classroomIds,
                ),
            };
        },
        {
            body: t.Object({
                slotDataId: t.Nullable(t.Numeric()),
                slotId: t.Numeric(),
                subjectId: t.Nullable(t.Numeric()),
                teacherId: t.Nullable(t.Numeric()),
                subdivisionIds: t.Array(t.Numeric()),
                classroomIds: t.Array(t.Numeric()),
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
                slotId,
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
                teacherId: t.Nullable(t.Numeric()),
                subdivisionIds: t.Array(t.Numeric()),
                classroomIds: t.Array(t.Numeric()),
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

import { SlotDatas } from "../database";

async function deleteSlotData(slotDataId: number) {
    const slotData = await SlotDatas.destroy({
        where: {
            id: slotDataId,
        },
    });
    return slotData;
}

export default deleteSlotData;
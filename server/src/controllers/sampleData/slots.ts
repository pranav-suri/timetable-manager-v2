import { prisma } from "../..";
import { SlotInfo } from "./csvHeaders";
import { parseCsvData, removeDuplicates, validateCsvData } from "./utils";
import { Prisma } from "@prisma/client";

export async function uploadSlotsData(csvData: string, timetableId: number) {
    const parsedCsv = await parseCsvData<SlotInfo>(csvData);
    if (!validateCsvData(parsedCsv, "slot")) {
        return false;
    }
    let slotCreate: Prisma.SlotCreateManyInput[] = [];
    for (const row of parsedCsv.data) {
        const { day, number } = row;

        slotCreate.push({
            day: Number(day),
            number: Number(number),
            timetableId: timetableId,
        });
    }
    slotCreate = removeDuplicates(slotCreate);
    await prisma.slot.createMany({
        data: slotCreate,
    });
    return true;
}

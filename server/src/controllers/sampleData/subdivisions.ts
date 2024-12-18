import { Prisma } from "@prisma/client";
import { BatchAndSubdivisionData } from "./csvHeaders";
import {
    parseCsvData,
    validateCsvData,
    removeDuplicates,
    joinSubdivisionName,
} from "./utils";
import { prisma } from "../..";

export async function uploadSubdivsionData(
    csvData: string,
    timetableId: number,
) {
    const parsedCsv = await parseCsvData<BatchAndSubdivisionData>(csvData);
    if (!validateCsvData(parsedCsv, "batchAndSubdivision")) return false;

    // Creating subdivisions
    let subdivisionCreate: Prisma.SubdivisionCreateManyInput[] = [];
    for (const row of parsedCsv.data) {
        const {
            batch_name: batchName,
            department_name: departmentName,
            // division_name is not required as it already a part of subdivision name
            subdivision_name: subdivisionName,
        } = row;

        // creating a subdivision name
        const joinedName = joinSubdivisionName({
            batchName,
            departmentName,
            subdivisionName,
        });

        subdivisionCreate.push({
            name: joinedName,
            timetableId,
        });
    }
    subdivisionCreate = removeDuplicates(subdivisionCreate);
    await prisma.subdivision.createMany({
        data: subdivisionCreate,
    });
    return true;
}

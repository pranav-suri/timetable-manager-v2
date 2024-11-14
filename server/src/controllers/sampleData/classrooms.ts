import { Prisma } from "@prisma/client";
import { ClassroomData } from "./csvHeaders";
import { parseCsvData, validateCsvData, removeDuplicates } from "./utils";
import { prisma } from "../..";

export async function uploadClassroomData(
    csvData: string,
    timetableId: number,
) {
    const parsedCsv = await parseCsvData<ClassroomData>(csvData);
    if (!validateCsvData(parsedCsv, "classroom")) {
        return false;
    }
    let classroomCreate: Prisma.ClassroomCreateManyInput[] = [];
    for (const row of parsedCsv.data) {
        const { classroom_name: name } = row;
        classroomCreate.push({
            name,
            timetableId: timetableId,
        });
    }
    classroomCreate = removeDuplicates(classroomCreate);
    await prisma.classroom.createMany({
        data: classroomCreate,
    });
    return true;
}

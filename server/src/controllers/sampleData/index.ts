import { prisma } from "../..";
import { uploadClassroomData } from "./classrooms";
import { uploadTimetableData } from "./lectures";
import { uploadSlotsData } from "./slots";
import { uploadSubdivsionData } from "./subdivisions";
import { uploadSubjectAndTeacherData } from "./subjectAndTeacher";
import path from "path";

async function sampleDataUpload(timetableName: string) {
    const timetable = await prisma.timetable.upsert({
        create: {
            name: timetableName,
        },
        update: {},
        where: {
            name: timetableName,
        },
    });

    /**
     * Subdivision data
     */
    const batchAndSubData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/batch_and_subdivision.csv"),
    ).text();
    await uploadSubdivsionData(batchAndSubData, timetable.id);

    /**
     * Slot data
     */
    const slotData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/slot.csv"),
    ).text();
    await uploadSlotsData(slotData, timetable.id);

    /**
     * Classroom data
     */
    const classroomData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/classroom.csv"),
    ).text();
    await uploadClassroomData(classroomData, timetable.id);

    /**
     * Subject and teacher data
     */
    const subAndTeacherData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/subject_and_teacher.csv"),
    ).text();
    await uploadSubjectAndTeacherData(subAndTeacherData, timetable.id);

    /**
     * Timetable data
     */
    const timetableData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/timetable.csv"),
    ).text();
    await uploadTimetableData(timetableData, timetable.id);
    console.log(`All data for ${timetableName} uploaded successfully`);
}

export default sampleDataUpload;

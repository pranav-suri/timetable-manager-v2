import { prisma } from "../..";
import { uploadClassroomData } from "./classrooms";
import { uploadTimetableData } from "./lectures";
import { uploadSlotsData } from "./slots";
import { uploadSubdivsionData } from "./subdivisions";
import { uploadSubjectAndTeacherData } from "./subjectAndTeacher";
import path from "path";

async function sampleDataUpload() {
    const timetable1 = await prisma.timetable.upsert({
        create: {
            name: "ODD",
        },
        update: {},
        where: {
            name: "ODD",
        },
    });

    const timetable2 = await prisma.timetable.upsert({
        create: {
            name: "EVEN",
        },
        update: {},
        where: {
            name: "EVEN",
        },
    });

    /**
     * Subdivision data
     */
    const batchAndSubData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/batch_and_subdivision.csv"),
    ).text();
    await uploadSubdivsionData(batchAndSubData, timetable1.id);
    await uploadSubdivsionData(batchAndSubData, timetable2.id);
    console.log("Subdivision data uploaded successfully");

    /**
     * Slot data
     */
    const slotData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/slot.csv"),
    ).text();
    await uploadSlotsData(slotData, timetable1.id);
    await uploadSlotsData(slotData, timetable2.id);
    console.log("Slot data uploaded successfully");

    /**
     * Classroom data
     */
    const classroomData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/classroom.csv"),
    ).text();
    await uploadClassroomData(classroomData, timetable1.id);
    await uploadClassroomData(classroomData, timetable2.id);
    console.log("Classroom data uploaded successfully");

    /**
     * Subject and teacher data
     */
    const subAndTeacherData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/subject_and_teacher.csv"),
    ).text();
    await uploadSubjectAndTeacherData(subAndTeacherData, timetable1.id);
    await uploadSubjectAndTeacherData(subAndTeacherData, timetable2.id);
    console.log("Subject and teacher data uploaded successfully");

    /**
     * Timetable data
     */
    const timetableData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/timetable.csv"),
    ).text();
    await uploadTimetableData(timetableData, timetable1.id);
    await uploadTimetableData(timetableData, timetable2.id);
    console.log("Timetable data uploaded successfully");
    console.log("All data uploaded");
}

export default sampleDataUpload;

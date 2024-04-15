import {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadTestSlotData,
    uploadSubjectAndTeacherData,
    uploadUnavailabilityData,
    uploadTimetableData,
} from "./dataUpload";
import sequelize from "../../database/sequelize";
import { AcademicYear } from "../../database";

    async function sampleDataUpload({syncDatabase} = {syncDatabase: true}) {
    if (syncDatabase) {
        await sequelize
            .query("SET FOREIGN_KEY_CHECKS = 0")
            .then(() => sequelize.sync({ force: true }))
            .then(() => sequelize.query("SET FOREIGN_KEY_CHECKS = 1"))
            .then(() => console.log("Database synchronised."));
    }
    const [academicYear1, isCreatedAcademicYear1] = await AcademicYear.findOrCreate({
        where: { year: 2024, name: "ODD" },
    });

    const [academicYear2, isCreatedAcademicYear2] = await AcademicYear.findOrCreate({
        where: { year: 2024, name: "EVEN" },
    });

    /**
     * Batch and subdivision data
     */
    const batchAndSubData = await Bun.file("./SAMPLE_DATA/batch_and_subdivision.csv").text();
    await uploadBatchAndSubdivsionData(batchAndSubData, academicYear1.id);
    await uploadBatchAndSubdivsionData(batchAndSubData, academicYear2.id);
    console.log("Batch and subdivision data uploaded successfully");

    /**
     * Slot data
     */
    const slotData = await Bun.file("./SAMPLE_DATA/slot.csv").text();
    await uploadTestSlotData(slotData, academicYear1.id);
    await uploadTestSlotData(slotData, academicYear2.id);
    console.log("Slot data uploaded successfully");

    /**
     * Classroom data
     */
    const classroomData = await Bun.file("./SAMPLE_DATA/classroom.csv").text();
    await uploadClassroomData(classroomData, academicYear1.id);
    await uploadClassroomData(classroomData, academicYear2.id);
    console.log("Classroom data uploaded successfully");

    /**
     * Subject and teacher data
     */
    const subAndTeacherData = await Bun.file("./SAMPLE_DATA/subject_and_teacher.csv").text();
    await uploadSubjectAndTeacherData(subAndTeacherData, academicYear1.id);
    await uploadSubjectAndTeacherData(subAndTeacherData, academicYear2.id);
    console.log("Subject and teacher data uploaded successfully");

    /**
     * Timetable data
     */
    const timetableData = await Bun.file("./SAMPLE_DATA/timetable.csv").text();
    await uploadTimetableData(timetableData, academicYear1.id);
    await uploadTimetableData(timetableData, academicYear2.id);
    console.log("Timetable data uploaded successfully");
    console.log("All data uploaded");
}

export default sampleDataUpload;

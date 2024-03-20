import {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadTestSlotData,
    uploadSubjectAndTeacherData,
    uploadUnavailabilityData,
} from "./dataUpload";
import AcademicYear from "../../database/academicYear";

async function sampleDataUpload() {
    const [academicYear1, isCreatedAcademicYear1] = await AcademicYear.findOrCreate({
        where: { year: 2024, name: "ODD" },
    });

    const [academicYear2, isCreatedAcademicYear2] = await AcademicYear.findOrCreate({
        where: { year: 2024, name: "EVEN" },
    });

    /**
     * Batch and subdivision data
     */
    const batchAndSubData = await Bun.file("./src/sampleData/batch_and_subdivision.csv").text();

    await uploadBatchAndSubdivsionData(batchAndSubData, academicYear1.id);
    console.log("Batch and subdivision data 1 uploaded successfully");

    await uploadBatchAndSubdivsionData(batchAndSubData, academicYear2.id);
    console.log("Batch and subdivision data 2 uploaded successfully");

    /**
     * Slot data
     */
    const slotData = await Bun.file("./src/sampleData/slot.csv").text();

    await uploadTestSlotData(slotData, academicYear1.id);
    console.log("Slot data 1 uploaded successfully");

    await uploadTestSlotData(slotData, academicYear2.id);
    console.log("Slot data 2 uploaded successfully");

    /**
     * Classroom data
     */
    const classroomData = await Bun.file("./src/sampleData/classroom.csv").text();

    await uploadClassroomData(classroomData, academicYear1.id);
    console.log("Classroom data 1 uploaded successfully");

    await uploadClassroomData(classroomData, academicYear2.id);
    console.log("Classroom data 2 uploaded successfully");

    /**
     * Subject and teacher data
     */
    const subAndTeacherData = await Bun.file("./src/sampleData/subject_and_teacher.csv").text();

    await uploadSubjectAndTeacherData(subAndTeacherData, academicYear1.id);
    console.log("Subject and teacher 1 data uploaded successfully");

    await uploadSubjectAndTeacherData(subAndTeacherData, academicYear2.id);
    console.log("Subject and teacher data 2 uploaded successfully");
    console.log("All data uploaded");
}

export default sampleDataUpload;

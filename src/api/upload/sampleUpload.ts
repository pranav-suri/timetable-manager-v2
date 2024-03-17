import {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadTestSlotData,
    uploadSubjectAndTeacherData,
    uploadUnavailabilityData,
} from "./dataUpload";
import AcademicYear from "../../database/academicYear";

async function sampleDataUpload() {
    const [academicYear1, isCreatedAcademicYear1] =
        await AcademicYear.findOrCreate({
            where: { year: 2024, name: "ODD" },
        });

    const [academicYear2, isCreatedAcademicYear2] =
        await AcademicYear.findOrCreate({
            where: { year: 2024, name: "EVEN" },
        });

    let batchAndSubdivisionData = await Bun.file(
        "./src/sampleData/batch_and_subdivision.csv"
    ).text();
    if (
        await uploadBatchAndSubdivsionData(
            batchAndSubdivisionData,
            academicYear1.id
        )
    ) {
        console.log("Batch and subdivision data 1 uploaded successfully");
    }
    if (
        await uploadBatchAndSubdivsionData(
            batchAndSubdivisionData,
            academicYear2.id
        )
    ) {
        console.log("Batch and subdivision data 2 uploaded successfully");
    }

    let slotData = await Bun.file("./src/sampleData/slot.csv").text();
    if (await uploadTestSlotData(slotData, academicYear1.id)) {
        console.log("Slot data 1 uploaded successfully");
    }
    if (await uploadTestSlotData(slotData, academicYear2.id)) {
        console.log("Slot data 2 uploaded successfully");
    }

    let classroomData = await Bun.file("./src/sampleData/classroom.csv").text();
    if (await uploadClassroomData(classroomData, academicYear1.id)) {
        console.log("Classroom data 1 uploaded successfully");
    }
    if (await uploadClassroomData(classroomData, academicYear2.id)) {
        console.log("Classroom data 2 uploaded successfully");
    }

    let subjectAndTeacherData = await Bun.file(
        "./src/sampleData/subject_and_teacher.csv"
    ).text();
    if (
        await uploadSubjectAndTeacherData(
            subjectAndTeacherData,
            academicYear1.id
        )
    ) {
        console.log("Subject and teacher 1 data uploaded successfully");
    }
    if (
        await uploadSubjectAndTeacherData(
            subjectAndTeacherData,
            academicYear2.id
        )
    ) {
        console.log("Subject and teacher data 2 uploaded successfully");
    }
    console.log("All data uploaded");
}

export default sampleDataUpload;

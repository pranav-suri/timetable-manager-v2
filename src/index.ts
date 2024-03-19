import Elysia from "elysia";
import cors from "@elysiajs/cors";
import {
    AcademicYear,
    Batch,
    Classroom,
    Department,
    Division,
    Group,
    Slot,
    Subdivision,
    Subject,
    Teach,
    Teacher,
    TeacherUnavailable,
    SlotData,
    SlotDataClass,
} from "./database";
import {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadSubjectAndTeacherData,
    uploadUnavailabilityData,
} from "./api/upload/dataUpload";
import sampleDataUpload from "./api/upload/sampleUpload";
import { where, Sequelize, Op } from "sequelize";
const app = new Elysia();

app.use(cors({ methods: ["GET"] }));

app.get("/", (request) => {
    return { message: `${Date.now()}` };
});

app.get("/create", async (req) => {
    return { academicYears: await AcademicYear.findAll() };
});

app.get("/create/:academicYearId", async (req) => {
    const { academicYearId } = req.params;
    const {
        departmentId,
        divisionId,
        batchId,
        slotId,
        subjectId,
        teacherId,
        classroomId,
    } = req.query;
    if (departmentId && divisionId && batchId && slotId) {
        
    }
        if (departmentId && divisionId && batchId) {
            const subdivisions = await Subdivision.findAll({
                where: { DivisionId: divisionId },
            });
            const subdivisionIds = subdivisions.map(
                (subdivision) => subdivision.id
            );
            const slots = await Slot.findAll({
                where: {
                    AcademicYearId: academicYearId,
                },
            });
            const slotDatas = await SlotData.findAll({
                where: {
                    SubdivisionId: {
                        [Op.in]: subdivisionIds,
                    },
                },
            });

            const teacherIds = slotDatas.map((slotData) => slotData.TeacherId);
            const teachers = await Teacher.findAll({
                where: {
                    id: {
                        [Op.in]: teacherIds,
                    },
                },
            });
            const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
            const subjects = await Subject.findAll({
                where: {
                    id: {
                        [Op.in]: subjectIds,
                    },
                },
            });

            const slotDataIds = slotDatas.map((slotData) => slotData.id);
            const slotDataClasses = await SlotDataClass.findAll({
                where: {
                    SlotDataId: {
                        [Op.in]: slotDataIds,
                    },
                },
            });
            const classIds = slotDataClasses.map(
                (slotDataClass) => slotDataClass.ClassroomId
            );

            const classrooms = await Classroom.findAll({
                where: {
                    id: {
                        [Op.in]: classIds,
                    },
                },
            });

            return {
                // Slots formation data
                slots: slots,
                // Slot content data
                slotDatas: slotDatas,
                // Retreival data
                teachers: teachers,
                subjects: subjects,
                subdivisions: subdivisions,
                slotDataClasses: slotDataClasses,
                classrooms: classrooms,
            };
        }
    if (batchId && departmentId) {
        return {
            divisions: await Division.findAll({
                where: { DepartmentId: departmentId },
            }),
        };
    }
    if (batchId) {
        return {
            departments: await Department.findAll({
                where: { BatchId: batchId },
            }),
        };
    }

    return {
        batches: await Batch.findAll({
            where: { AcademicYearId: academicYearId },
        }),
    };
});

app.put("/create/:", async (req) => {
    
})

app.post("/upload/:type", async (ctx) => {
    const { type } = ctx.params;
    const body = ctx.body;

    if (!body) {
        ctx.set.status = 400;
        return { message: "Invalid body" };
    }

    if (type === "timetable") {
        return;
    }
    return { message: "Invalid type" };
});

app.listen(3000);

console.log("Listening on port 3000\nhttp://localhost:3000/");

// This function will upload the sample data to the database, uncomment to run.
// sampleDataUpload();

/**
 * Try visiting http://localhost:3000/slots: you should see an empty array.
 * Try visiting http://localhost:3000/teachers: you should see an empty array.
 * Try visiting http://localhost:3000/slots/1: you should see a 404 error.
 * Try visiting http://localhost:3000/teachers/1: you should see a 404 error.
 *
 * To use the post queries, you can install and use Postman from https://www.postman.com/downloads/.
 * Set the query type to POST and the URL to http://localhost:3000/slots?day=Monday&start=9:00&end=10:00.
 */

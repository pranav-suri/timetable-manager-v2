import { prisma } from "../..";
import { TimetableData } from "./csvHeaders";
import { parseCsvData, validateCsvData, joinSubdivisionName } from "./utils";

export async function uploadTimetableData(
    csvData: string,
    timetableId: number,
) {
    const parsedCsv = await parseCsvData<TimetableData>(csvData);

    if (!validateCsvData(parsedCsv, "timetable")) {
        return false;
    }

    for (const row of parsedCsv.data) {
        // Step 1: Lookup existing related entities by their unique identifiers
        const { classroom, slot, subdivision, subject, teacher } =
            await fetchInformation(row, timetableId);

        // Step 2: Check if the Lecture entry with subject and teacher
        const lecture = await prisma.lecture.findFirst({
            where: {
                teacherId: teacher.id,
                subjectId: subject.id,
            },
        });

        // Step 3: If Lecture does not exist, create it with related entries
        if (!lecture) {
            await createLectureWithSlotData({
                teacherId: teacher.id,
                subjectId: subject.id,
                subdivisionId: subdivision.id,
                classroomId: classroom.id,
                slotId: slot.id,
            });
            continue;
        }

        // A lecture exists but it may not be the one we need
        // Check if that lecture has the same slot in slotData
        const slotData = await prisma.slotData.findUnique({
            where: {
                slotId_lectureId: {
                    lectureId: lecture.id,
                    slotId: slot.id,
                },
            },
        });

        if (!slotData) {
            // The lecture is not the correct lecture
            // Create a new lecture with related entries
            await createLectureWithSlotData({
                teacherId: teacher.id,
                subjectId: subject.id,
                subdivisionId: subdivision.id,
                classroomId: classroom.id,
                slotId: slot.id,
            });
            continue;
        }

        // The lecture is the correct lecture
        // Add the subdivision and classroom to the lecture if they don't exist

        // Find or Create the lectureSubdivision entry
        await upsertLectureSubdivision({
            lectureId: lecture.id,
            subdivisionId: subdivision.id,
        });

        // Find or Create LectureClassroom entry
        await upsertLectureClassroom({
            lectureId: lecture.id,
            classroomId: classroom.id,
        });
    }

    return true;
}

async function fetchInformation(row: TimetableData, timetableId: number) {
    const {
        day,
        slot_number: slotNumber,
        department_name: departmentName,
        batch_name: batchName,
        subdivision_name: subdivisionName,
        subject_name: subjectName,
        group_name: groupName,
        teacher_email: teacherEmail,
        classroom_name: classroomName,
    } = row;

    const joinedSubdivisionName = joinSubdivisionName({
        batchName,
        departmentName,
        subdivisionName,
    });

    // Step 1: Lookup existing related entities by their unique identifiers
    const teacher = await prisma.teacher.findUnique({
        where: { email_timetableId: { email: teacherEmail, timetableId } },
    });
    const group = await prisma.group.findUnique({
        where: { name_timetableId: { name: groupName, timetableId } },
    });

    if (!group) {
        console.error("Missing group data for row:", row);
        throw new Error();
    }
    const subject = await prisma.subject.findUnique({
        where: {
            name_groupId: { name: subjectName, groupId: group?.id },
        },
    });
    const slot = await prisma.slot.findUnique({
        where: {
            day_number_timetableId: {
                day: Number(day),
                number: Number(slotNumber),
                timetableId,
            },
        },
    });
    const subdivision = await prisma.subdivision.findUnique({
        where: {
            name_timetableId: { name: joinedSubdivisionName, timetableId },
        },
    });
    const classroom = await prisma.classroom.findUnique({
        where: { name_timetableId: { name: classroomName, timetableId } },
    });

    if (!teacher || !subject || !slot || !subdivision || !classroom || !group) {
        if (!teacher)
            console.error("Missing teacher data for row:", teacherEmail);
        if (!subject)
            console.error("Missing subject data for row:", subjectName);
        if (!slot) console.error("Missing slot data for row:", day, slotNumber);
        if (!subdivision)
            console.error("Missing subdivision data for row:", row);
        if (!classroom)
            console.error("Missing classroom data for row:", classroomName);
        if (!group) console.error("Missing group data for row:", groupName);

        console.error("Missing related data for row:", row);
        throw new Error();
    }

    return { teacher, subject, slot, subdivision, classroom, group };
}

async function createLectureWithSlotData({
    teacherId,
    subjectId,
    subdivisionId,
    classroomId,
    slotId,
}: CreateLectureArgs & { slotId: number }) {
    const lecture = await createLecture({
        teacherId,
        subjectId,
        subdivisionId,
        classroomId,
    });
    await createSlotData({ slotId, lectureId: lecture.id });
}

type CreateLectureArgs = {
    teacherId: number;
    subjectId: number;
    subdivisionId: number;
    classroomId: number;
};
async function createLecture({
    teacherId,
    subjectId,
    subdivisionId,
    classroomId,
}: CreateLectureArgs) {
    return await prisma.lecture.create({
        data: {
            teacherId,
            subjectId,
            subdivisions: {
                create: [{ subdivisionId }],
            },
            classrooms: {
                create: [{ classroomId }],
            },
        },
    });
}

type CreateSlotDataArgs = {
    slotId: number;
    lectureId: number;
};
async function createSlotData({ slotId, lectureId }: CreateSlotDataArgs) {
    return await prisma.slotData.create({
        data: {
            slotId,
            lectureId,
        },
    });
}

/**
 * Find or Create LectureSubdivision entry
 */
async function upsertLectureSubdivision({
    lectureId,
    subdivisionId,
}: {
    lectureId: number;
    subdivisionId: number;
}) {
    return await prisma.lectureSubdivision.upsert({
        where: {
            subdivisionId_lectureId: {
                lectureId,
                subdivisionId,
            },
        },
        update: {},
        create: {
            lectureId,
            subdivisionId,
        },
    });
}

/**
 * Find or Create LectureClassroom entry
 */
async function upsertLectureClassroom({
    lectureId,
    classroomId,
}: {
    lectureId: number;
    classroomId: number;
}) {
    return await prisma.lectureClassroom.upsert({
        where: {
            classroomId_lectureId: {
                lectureId,
                classroomId,
            },
        },
        update: {},
        create: {
            lectureId,
            classroomId,
        },
    });
}

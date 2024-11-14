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
            await fetchInformation(row, timetableId, await prefetchTimetableData(timetableId));

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

// Pre-fetch all data into memory
async function prefetchTimetableData(timetableId: number) {
    const teachers = await prisma.teacher.findMany({
        where: { timetableId },
    });
    const groups = await prisma.group.findMany({
        where: { timetableId },
    });
    const subjects = await prisma.subject.findMany({
        where: { group: { timetableId } },
    });
    const slots = await prisma.slot.findMany({
        where: { timetableId },
    });
    const subdivisions = await prisma.subdivision.findMany({
        where: { timetableId },
    });
    const classrooms = await prisma.classroom.findMany({
        where: { timetableId },
    });

    // Convert each list to a Map for quick lookup
    const teacherMap = new Map(
        teachers.map((teacher) => [
            `${teacher.email}_${teacher.timetableId}`,
            teacher,
        ]),
    );
    const groupMap = new Map(
        groups.map((group) => [`${group.name}_${group.timetableId}`, group]),
    );
    const subjectMap = new Map(
        subjects.map((subject) => [
            `${subject.name}_${subject.groupId}`,
            subject,
        ]),
    );
    const slotMap = new Map(
        slots.map((slot) => [
            `${slot.day}_${slot.number}_${slot.timetableId}`,
            slot,
        ]),
    );
    const subdivisionMap = new Map(
        subdivisions.map((subdivision) => [
            `${subdivision.name}_${subdivision.timetableId}`,
            subdivision,
        ]),
    );
    const classroomMap = new Map(
        classrooms.map((classroom) => [
            `${classroom.name}_${classroom.timetableId}`,
            classroom,
        ]),
    );

    return {
        teacherMap,
        groupMap,
        subjectMap,
        slotMap,
        subdivisionMap,
        classroomMap,
    };
}

async function fetchInformation(
    row: TimetableData,
    timetableId: number,
    {
        teacherMap,
        groupMap,
        subjectMap,
        slotMap,
        subdivisionMap,
        classroomMap,
    }: Awaited<ReturnType<typeof prefetchTimetableData>>,
) {
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

    // Step 1: Lookup existing related entities by their unique identifiers
    const joinedSubdivisionName = joinSubdivisionName({
        batchName,
        departmentName,
        subdivisionName,
    });

    const teacher = teacherMap.get(`${teacherEmail}_${timetableId}`);
    const group = groupMap.get(`${groupName}_${timetableId}`);
    const subject = group
        ? subjectMap.get(`${subjectName}_${group.id}`)
        : undefined;
    const slot = slotMap.get(`${day}_${slotNumber}_${timetableId}`);
    const subdivision = subdivisionMap.get(
        `${joinedSubdivisionName}_${timetableId}`,
    );
    const classroom = classroomMap.get(`${classroomName}_${timetableId}`);

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

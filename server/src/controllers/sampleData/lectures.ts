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

        if (
            !teacher ||
            !subject ||
            !slot ||
            !subdivision ||
            !classroom ||
            !group
        ) {
            if (!teacher)
                console.error(
                    "Missing teacher data for row:",
                    row.teacher_email,
                );
            if (!subject)
                console.error(
                    "Missing subject data for row:",
                    row.subject_name,
                );
            if (!slot)
                console.error(
                    "Missing slot data for row:",
                    row.day,
                    row.slot_number,
                );
            if (!subdivision)
                console.error("Missing subdivision data for row:", row);
            if (!classroom)
                console.error(
                    "Missing classroom data for row:",
                    row.classroom_name,
                );
            if (!group)
                console.error("Missing group data for row:", row.group_name);

            console.error("Missing related data for row:", row);
            throw new Error(); // Skip to next row if any related data is missing
        }

        // Step 2: Check if the Lecture entry with subject and teacher
        let lecture = await prisma.lecture.findFirst({
            where: {
                teacherId: teacher.id,
                subjectId: subject.id,
            },
        });

        // Step 3: If Lecture does not exist, create it with related entries
        if (!lecture) {
            lecture = await prisma.lecture.create({
                data: {
                    teacherId: teacher.id,
                    subjectId: subject.id,
                    subdivisions: {
                        create: [{ subdivisionId: subdivision.id }],
                    },
                    classrooms: {
                        create: [{ classroomId: classroom.id }],
                    },
                },
            });
            // Create a new slotData entry
            await prisma.slotData.create({
                data: {
                    slotId: slot.id,
                    lectureId: lecture.id,
                },
            });
        } else {
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
            if (slotData) {
                // The lecture is the correct lecture
                // Add the subdivision and classroom to the lecture if they don't exist

                // Find or Create the lectureSubdivision entry
                await prisma.lectureSubdivision.upsert({
                    where: {
                        subdivisionId_lectureId: {
                            lectureId: lecture.id,
                            subdivisionId: subdivision.id,
                        },
                    },
                    update: {}, // No update action needed if it already exists
                    create: {
                        lectureId: lecture.id,
                        subdivisionId: subdivision.id,
                    },
                });

                // Find or Create LectureClassroom entry
                await prisma.lectureClassroom.upsert({
                    where: {
                        classroomId_lectureId: {
                            lectureId: lecture.id,
                            classroomId: classroom.id,
                        },
                    },
                    update: {}, // No update action needed if it already exists
                    create: {
                        lectureId: lecture.id,
                        classroomId: classroom.id,
                    },
                });
            } else {
                // The lecture is not the correct lecture
                // Create a new lecture with related entries
                lecture = await prisma.lecture.create({
                    data: {
                        teacherId: teacher.id,
                        subjectId: subject.id,
                        subdivisions: {
                            create: [{ subdivisionId: subdivision.id }],
                        },
                        classrooms: {
                            create: [{ classroomId: classroom.id }],
                        },
                    },
                });

                // Create a new slotData entry
                await prisma.slotData.create({
                    data: {
                        slotId: slot.id,
                        lectureId: lecture.id,
                    },
                });
            }
        }
    }
}

import path from "path";
import { SubjectAndTeacherData } from "./csvHeaders";
import { parseCsvData, validateCsvData } from "./utils";
import Papa from "papaparse";

/**
 * This function fixes the teacher_name field in the subject_and_teacher.csv file
 * If the same email has been mapped to multiple teachers, it will
 * replace the teacher_name if the name first found.
 */
export async function fixSubjectAndTeacherFile() {
    const csvData = await Bun.file(
        path.join(__dirname, "./SAMPLE_DATA/subject_and_teacher.csv"),
    ).text();
    const parsedCsv = await parseCsvData<SubjectAndTeacherData>(csvData);
    if (!validateCsvData(parsedCsv, "subjectAndTeacher")) {
        return false;
    }

    const emailNameMapping: Record<string, string> = {};

    for (const row of parsedCsv.data) {
        if (!emailNameMapping[row.teacher_email])
            emailNameMapping[row.teacher_email] = row.teacher_name;
    }

    const fixedData = parsedCsv.data.map((row) => {
        return {
            ...row,
            teacher_name: emailNameMapping[row.teacher_email],
        };
    });

    const unparsedString = Papa.unparse({
        data: fixedData,
        fields: Object.keys(parsedCsv.data[0]),
    });

    Bun.write(
        path.join(__dirname, "./SAMPLE_DATA/fixed_subject_and_teacher.csv"),
        unparsedString,
    ).then(() => {
        console.log("Written successfully");
    });
}

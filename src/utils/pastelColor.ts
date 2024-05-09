import randomColor from "randomcolor";
const subjects: Record<string, string> = {};
export default function getPastelColor(subjectName: string) {
    if (!subjects[subjectName]) {
        subjects[subjectName] = randomColor({ format: "hsla", luminosity: "light" });
    }
    return subjects[subjectName];
}

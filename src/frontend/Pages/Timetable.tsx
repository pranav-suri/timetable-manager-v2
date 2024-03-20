export default function Timetable() {
    return (
        <div>
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i}>Element {i}</div>
            ))}
        </div>
    );
}

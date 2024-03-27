import React, { useEffect } from "react";

function validateSlotData() {}

export function Sidebar() {
    return (
        <aside className="sidebar timetable-generator">
            <h1 className="sidebar-header">Add Schedule</h1>
            <form method="post">
                <label htmlFor="course">Teacher</label>
                <select name="course" id="course"></select>
            </form>
        </aside>
    );
}

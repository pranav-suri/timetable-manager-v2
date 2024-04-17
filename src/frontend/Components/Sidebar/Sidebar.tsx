import React, { useEffect, useState } from "react";
import { fetchAndSet } from "../fetchAndSet";
import { TimetableResponse, TeacherResponse } from "../../../backend/api/routes/responseTypes";
import api from "../../index";
export function Sidebar() {
    const [{ teachers: teacherData }, setTeacherData] = useState<TeacherResponse>({ teachers: [] });
    const [
        {
            timetable: { slots },
        },
        setSlotData,
    ] = useState<TimetableResponse>({ timetable: { slots: [] } });

    useEffect(() => {
        fetchAndSet(setTeacherData, api.academicYears({ id: 1 }).teachers.get());
    }, []);

    return (
        <>
            <h1 className="sidebar-header">Add Schedule</h1>
            <form method="post">
                <label htmlFor="course">Teacher</label>
                <select>
                    {teacherData.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.teacherName}
                        </option>
                    ))}
                </select>
                ;
            </form>
        </>
    );
}

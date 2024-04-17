import React from "react";
import { TimetableResponse } from "../../backend/api/routes/responseTypes";

const timetableData = await fetch("http://localhost:3000/divisions/2/timetable");
const timetableJson = await timetableData.json();
console.log(timetableJson);

export const TimetableDataContext = React.createContext<TimetableResponse>(
    timetableJson as TimetableResponse,
);

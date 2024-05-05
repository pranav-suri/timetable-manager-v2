import React, { useState, Dispatch } from "react";
import { TimetableResponse } from "../../backend/api/routes/responseTypes";
import { To } from "react-router-dom";

type TimetableDataContextType = {
    timetable: {
        available: boolean;
        timetableData: TimetableResponse;
    };
    setTimetable: Dispatch<TimetableResponse>;
    setAvailable: Dispatch<boolean>;
};

export const TimetableDataContext = React.createContext<TimetableDataContextType>({
    timetable: { available: false, timetableData: {} as TimetableResponse },
    setTimetable: () => {},
    setAvailable: () => {},
});

export const TimetableDataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [timetable, setTimetable] = useState<TimetableResponse>();
    const [available, setAvailable] = useState<boolean>(false);

    return (
        <TimetableDataContext.Provider
            value={{
                timetable: { available, timetableData: timetable ?? ({} as TimetableResponse) },
                setTimetable,
                setAvailable,
            }}
        >
            {children}
        </TimetableDataContext.Provider>
    );
};

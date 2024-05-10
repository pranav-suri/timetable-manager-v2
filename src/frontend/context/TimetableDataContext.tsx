import React, { useState, Dispatch } from "react";
import { TimetableResponse } from "../../backend/api/routes/responseTypes";
import { Updater, useImmer } from "use-immer";

type TimetableDataContextType = {
    timetable: {
        available: boolean;
        timetableData: TimetableResponse;
    };
    legend: Record<string, string>;
    setLegend: Dispatch<Record<string, string>>;
    setTimetable: Updater<TimetableResponse>;
    setAvailable: Dispatch<boolean>;
};

export const TimetableDataContext = React.createContext<TimetableDataContextType>({
    timetable: { available: false, timetableData: {} as TimetableResponse },
    legend: {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setLegend: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTimetable: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setAvailable: () => {},
});

export const TimetableDataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [timetable, setTimetable] = useImmer<TimetableResponse>(
        undefined as unknown as TimetableResponse,
    );
    const [available, setAvailable] = useState<boolean>(false);
    const [legend, setLegend] = useState<Record<string, string>>({});

    return (
        <TimetableDataContext.Provider
            value={{
                timetable: { available, timetableData: timetable ?? ({} as TimetableResponse) },
                legend,
                setLegend,
                setTimetable,
                setAvailable,
            }}
        >
            {children}
        </TimetableDataContext.Provider>
    );
};

import React, { createContext, useState } from "react";
import { TimetableType } from "../../utils/types";

type SelectedValuesContextType = {
    selectedValues: {
        timetableType: { selected: boolean; value: TimetableType };
        academicYear: { selected: boolean; value: string };
        batch: { selected: boolean; value: string };
        department: { selected: boolean; value: string };
        division: { selected: boolean; value: string };
        teacher: { selected: boolean; value: string };
        subject: { selected: boolean; value: string };
        classroom: { selected: boolean; value: string };
    };
    setSelectedValues: React.Dispatch<
        React.SetStateAction<SelectedValuesContextType["selectedValues"]>
    >;
};

const SelectedValuesContext = createContext<SelectedValuesContextType>({
    selectedValues: {
        timetableType: { selected: false, value: 0 },
        academicYear: { selected: false, value: "" },
        batch: { selected: false, value: "" },
        department: { selected: false, value: "" },
        division: { selected: false, value: "" },
        teacher: { selected: false, value: "" },
        subject: { selected: false, value: "" },
        classroom: { selected: false, value: "" },
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setSelectedValues: () => {},
});

const SelectedValuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedValues, setSelectedValues] = useState({
        timetableType: { selected: false, value: 0 },
        academicYear: { selected: false, value: "" },
        batch: { selected: false, value: "" },
        department: { selected: false, value: "" },
        division: { selected: false, value: "" },
        teacher: { selected: false, value: "" },
        subject: { selected: false, value: "" },
        classroom: { selected: false, value: "" },
    });

    return (
        <SelectedValuesContext.Provider value={{ selectedValues, setSelectedValues }}>
            {children}
        </SelectedValuesContext.Provider>
    );
};

export { SelectedValuesContext, SelectedValuesProvider };

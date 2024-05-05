import React, { createContext, useState } from "react";

type SelectedValuesContextType = {
    selectedValues: {
        academicYear: { selected: boolean; value: string };
        batch: { selected: boolean; value: string };
        department: { selected: boolean; value: string };
        division: { selected: boolean; value: string };
        teacher: { selected: boolean; value: string };
        subject: { selected: boolean; value: string };
    };
    setSelectedValues: React.Dispatch<
        React.SetStateAction<SelectedValuesContextType["selectedValues"]>
    >;
};

const SelectedValuesContext = createContext<SelectedValuesContextType>({
    selectedValues: {
        academicYear: { selected: false, value: "" },
        batch: { selected: false, value: "" },
        department: { selected: false, value: "" },
        division: { selected: false, value: "" },
        teacher: { selected: false, value: "" },
        subject: { selected: false, value: "" },
    },
    setSelectedValues: () => {},
});

const SelectedValuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedValues, setSelectedValues] = useState({
        academicYear: { selected: false, value: "" },
        batch: { selected: false, value: "" },
        department: { selected: false, value: "" },
        division: { selected: false, value: "" },
        teacher: { selected: false, value: "" },
        subject: { selected: false, value: "" },
    });

    return (
        <SelectedValuesContext.Provider value={{ selectedValues, setSelectedValues }}>
            {children}
        </SelectedValuesContext.Provider>
    );
};

export { SelectedValuesContext, SelectedValuesProvider };

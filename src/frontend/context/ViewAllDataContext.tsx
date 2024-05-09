import React, { createContext, useState } from "react";

type ViewAllDataContextType = {
    viewAllData: boolean;
    setViewAllData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ViewAllDataContext = createContext<ViewAllDataContextType>({
    viewAllData: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setViewAllData: () => {},
});

const ViewAllDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [viewAllData, setViewAllData] = useState(false);

    return (
        <ViewAllDataContext.Provider value={{ viewAllData, setViewAllData }}>
            {children}
        </ViewAllDataContext.Provider>
    );
};

export { ViewAllDataContext, ViewAllDataProvider };

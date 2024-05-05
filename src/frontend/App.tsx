import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Timetable from "./Pages/Timetable";
import { TimetableDataContextProvider } from "./context/TimetableDataContext";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import TimetableNewPage from "./Pages/TimetableNewPage";
import TimetableCombined from "./Pages/Timetable Combined";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="pranavTT" element={<TimetableNewPage />} />

                <Route
                    path="/new"
                    element={
                        <TimetableDataContextProvider>
                            <Timetable />
                        </TimetableDataContextProvider>
                    }
                />
                <Route
                    path="/combined"
                    element={
                        <TimetableDataContextProvider>
                            <TimetableCombined />
                        </TimetableDataContextProvider>
                    }
                />
                <Route path="/" element={<TimetableNewPage />} />
            </Routes>
        </Router>
    );
}

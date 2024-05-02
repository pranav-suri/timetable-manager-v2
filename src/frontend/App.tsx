import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Timetable from "./Pages/Timetable";
import { TimetableDataContext } from "./context/TimetableDataContext";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import TimetableNewPage from "./Pages/TimetableNewPage";

export default function App() {
    const data = useContext(TimetableDataContext);
    return (
        <Router>
            <Routes>
                <Route path="pranavTT" element={<TimetableNewPage />} />
                <Route path="/new" element={<Timetable />} />
                <Route path="/" element={<TimetableNewPage />} />
            </Routes>
        </Router>
    );
}

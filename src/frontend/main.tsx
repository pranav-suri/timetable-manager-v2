import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Upload from "./Components/CSV/Upload.tsx";

globalThis.createModal = (test) => {
    alert(test);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/upload/:name" element={<Upload />} />
            </Routes>
        </Router>
    </React.StrictMode>,
);

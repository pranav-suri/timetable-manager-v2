import React from "react";
import AddCsv from "./AddCSV"; // Assuming you have the UploadCSV component in a separate file
import "./UploadCSV.css";

const Upload: React.FC = () => {
    return (
        <div className="input-container">
            <div>
                <label htmlFor="batchSubdivision">Batch and Subdivision:</label>
                <AddCsv />
            </div>
            <div>
                <label htmlFor="classroom">Classroom:</label>
                <AddCsv />
            </div>
            <div>
                <label htmlFor="slot">Slot:</label>
                <AddCsv />
            </div>
            <div>
                <label htmlFor="subjectTeacher">Subject and Teacher:</label>
                <AddCsv />
            </div>
        </div>
    );
};

export default Upload;

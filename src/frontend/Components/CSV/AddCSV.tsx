import React, { useState } from "react";
import "./UploadCSV.css"; // Import CSS file

// Component definition...

const UploadCSV: React.FC = () => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        uploadFiles(files[0]); // Assuming single file upload
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            uploadFiles(files[0]); // Assuming single file upload
        }
    };

    const uploadFiles = (file: File) => {
        // Handle file upload logic here
        setUploadedFile(file);
    };

    const handleClick = () => {
        if (uploadedFile) {
            // Assuming the file is a text file for simplicity
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    const fileContent = event.target.result;
                    alert(fileContent); // Display file content for demonstration
                }
            };
            reader.readAsText(uploadedFile);
        }
    };

    return (
        <div>
            {uploadedFile ? (
                <div className="file-box" onClick={handleClick}>
                    <p>Uploaded file: {uploadedFile.name}</p>
                    {/* Add more information about the uploaded file if needed */}
                </div>
            ) : (
                <div
                    className={`upload-container ${isDragOver ? "drag-over" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={handleFileInputChange}
                    />
                    <label htmlFor="fileInput">Drag & Drop files here or click to upload</label>
                </div>
            )}
        </div>
    );
};

export default UploadCSV;

// import React, { useState } from 'react';

// function App() {
//     const [selectedFile, setSelectedFile] = useState(null);

//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFile) return;

//         const formData = new FormData();
//         formData.append('csvFile', selectedFile);

//         try {
//             const response = await fetch('/upload', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (response.ok) {
//                 console.log('File uploaded successfully!');
//                 setSelectedFile(null); // Clear selected file after upload
//             } else {
//                 console.error('Error uploading file:', response.statusText);
//             }
//         } catch (error) {
//             console.error('Error uploading file:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Upload CSV</h1>
//             <input type="file" onChange={handleFileChange} accept=".csv" />
//             {selectedFile && <p>Selected file: {selectedFile.name}</p>}
//             <button onClick={handleFileUpload} disabled={!selectedFile}>Upload</button>
//         </div>
//     );
// }

// export default App;

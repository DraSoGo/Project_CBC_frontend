import { useState } from "react";

export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("https://project-cbc-backend-c2co.onrender.com/predict/", {
      method: "POST",
      body: formData,
    });
    

    const blob = await response.blob();
    setProcessedImage(URL.createObjectURL(blob));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">YOLOv5 Image Detection</h1>
      
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      
      {imagePreview && <img src={imagePreview} alt="Uploaded" className="w-64 h-auto mb-4 rounded-lg shadow-md" />}
      
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
        Upload & Detect
      </button>

      {processedImage && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Processed Image:</h2>
          <img src={processedImage} alt="Processed" className="w-64 h-auto rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
}

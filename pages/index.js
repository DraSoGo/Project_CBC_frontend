import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #181818;
  color: white;
  font-family: "Poppins", sans-serif;
  text-align: center;
  padding: 20px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  background: #0070f3;
  color: white;
  font-size: 1rem;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #0050c7;
    transform: scale(1.05);
  }
`;

const DetectButton = styled.button`
  background: #28a745;
  color: white;
  font-size: 1rem;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #218838;
    transform: scale(1.05);
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
`;

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

    const response = await fetch("http://localhost:8000/predict/", {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    setProcessedImage(URL.createObjectURL(blob));
  };

  return (
    <Container>
      <Card>
        <h2>🩸 Upload pictures for blood detection</h2>

        {/* ปุ่ม Choose File และ Upload */}
        <ButtonContainer>
          <UploadButton htmlFor="file-upload">📂 Choose File</UploadButton>
          <HiddenInput
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <DetectButton onClick={handleUpload}>🚀 Upload & Detect</DetectButton>
        </ButtonContainer>

        {/* แสดงภาพที่อัปโหลด */}
        {imagePreview && <ImagePreview src={imagePreview} alt="Uploaded" />}
      </Card>

      {/* แสดงภาพที่ประมวลผล */}
      {processedImage && (
        <Card>
          <h3>🖼 Processed Image:</h3>
          <ImagePreview src={processedImage} alt="Processed" />
        </Card>
      )}
    </Container>
  );
}

import { useState } from "react";
import styled from "styled-components";

// 🎨 Styled Components
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
  margin-bottom: 20px;
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

const CellCountContainer = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
`;

const CellCountList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CellCountItem = styled.li`
  font-size: 1.1rem;
  margin: 5px 0;
  color: #f9f9f9;
`;

export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [cellCounts, setCellCounts] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setProcessedImage(null);
    setCellCounts(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("https://6168-61-7-240-70.ngrok-free.app/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error uploading file");
        return;
      }

      const data = await response.json();

      // ✅ อัปเดต UI
      setCellCounts(data.cell_counts);
      setProcessedImage(`data:image/jpeg;base64,${data.image}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <h2>🚀 YOLOv5 Image Detection</h2>

        <ButtonContainer>
          <UploadButton htmlFor="file-upload">📂 Choose File</UploadButton>
          <HiddenInput
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <DetectButton onClick={handleUpload} disabled={loading}>
            🚀 {loading ? "Processing..." : "Upload & Detect"}
          </DetectButton>
        </ButtonContainer>

        {/* แสดงภาพที่อัปโหลด */}
        {imagePreview && <ImagePreview src={imagePreview} alt="Uploaded" />}
      </Card>

      {/* แสดงข้อมูลเซลล์ที่ตรวจจับ */}
      {cellCounts && (
        <CellCountContainer>
          <h3>🧪 Detected Blood Cells:</h3>
          <CellCountList>
            {Object.entries(cellCounts).map(([cellType, count]) => (
              <CellCountItem key={cellType}>
                {cellType}: <strong>{count}</strong>
              </CellCountItem>
            ))}
          </CellCountList>
        </CellCountContainer>
      )}

      {/* แสดงภาพที่ประมวลผลแล้ว */}
      {processedImage && (
        <Card>
          <h3>🖼 Processed Image:</h3>
          <ImagePreview src={processedImage} alt="Processed" />
        </Card>
      )}
    </Container>
  );
}

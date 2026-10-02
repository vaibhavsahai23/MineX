import express from "express";
import fs from "fs";
import path from "path";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-File-Name");
  next();
});

const PORT = 5000;

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "MineX backend is running"
  });
});

app.post(
  "/api/upload",
  express.raw({ type: "application/octet-stream", limit: "50mb" }),
  (req, res) => {
    try {
      const fileName = req.header("X-File-Name");

      if (!fileName) {
        return res.status(400).json({
          status: "error",
          message: "File name is required"
        });
      }

      if (!req.body || req.body.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "No file data received"
        });
      }

      const safeFileName = path.basename(fileName);
      const filePath = path.join(uploadDir, safeFileName);

      fs.writeFileSync(filePath, req.body);

      res.json({
        status: "success",
        message: "File uploaded successfully",
        fileName: safeFileName,
        fileSize: req.body.length
      });
    } catch (error) {
      console.error("Upload error:", error);

      res.status(500).json({
        status: "error",
        message: "File upload failed"
      });
    }
  }
);
app.post("/api/process-text", (req, res) => {
  try {
    const fileName = req.header("X-File-Name");

    if (!fileName) {
      return res.status(400).json({
        status: "error",
        message: "File name is required"
      });
    }

    const safeFileName = path.basename(fileName);
    const filePath = path.join(uploadDir, safeFileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "error",
        message: "File not found"
      });
    }

    const extractedText = fs.readFileSync(filePath, "utf-8");

    res.json({
      status: "success",
      message: "Text extracted successfully",
      fileName: safeFileName,
      extractedText
    });
  } catch (error) {
    console.error("Text processing error:", error);

    res.status(500).json({
      status: "error",
      message: "Text processing failed"
    });
  }
});
app.listen(PORT, () => {
  console.log(`MineX backend running on http://localhost:${PORT}`);
});
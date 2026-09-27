import express from "express";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const PORT = 5000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "MineX backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`MineX backend running on http://localhost:${PORT}`);
});
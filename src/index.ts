import express from "express";
import authRouter from "./routes/auth.js";
import connectDB from "./db/connection.js";

const app = express();
const PORT = 3010;

// ミドルウェア
app.use(express.json());
app.use("/api/v1", authRouter);

connectDB();

// listen
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from "express";

const app = express();
const PORT = 3010;

app.get("/", (_, res) => {
  return res.send("Hello World!!");
});

// ユーザー新規登録API

// ユーザーログイン用API

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

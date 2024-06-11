import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 3010;
const uri = process.env.MONGODB_CONNECTION_STRING;

// DB接続
try{
  if(!uri) throw new Error("DB接続エラー: URIが設定されていません");
  await mongoose.connect(uri);
  } catch (error) {
  console.log(uri)
  console.log("DB接続エラー", error);
}

app.get("/", (_, res) => {
  return res.send("Hello World!!");
});

// ユーザー新規登録API

// ユーザーログイン用API

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGODB_CONNECTION_STRING;
  try {
    if (!uri) throw new Error("DB接続エラー: URIが設定されていません");
    await mongoose.connect(uri);
  } catch (error) {
    console.log(uri);
    console.log("DB接続エラー", error);
  }
}

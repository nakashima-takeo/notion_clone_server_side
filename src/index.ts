import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { encrypt } from "./aes.js";
import User from "./user.js";
import { body, validationResult } from "express-validator";

const app = express();
const PORT = 3010;
const uri = process.env.MONGODB_CONNECTION_STRING;

// ミドルウェア
app.use(express.json());

// DB接続
try {
  if (!uri) throw new Error("DB接続エラー: URIが設定されていません");
  await mongoose.connect(uri);
} catch (error) {
  console.log(uri);
  console.log("DB接続エラー", error);
}

app.get("/", (_, res) => {
  return res.send("Hello World!!");
});

// ユーザー新規登録API
app.post(
  "/register",

  // バリデーション
  body("name")
    .isString()
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上で入力してください"),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上で入力してください"),
  body("password_for_confirmation")
    .isString()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage("パスワードが一致しません"),
  body("name").custom(async (value) => {
    return User.findOne({ name: value }).then((user) => {
      if (user) {
        return Promise.reject("ユーザー名は既に使用されています");
      }
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  async (req, res) => {
    // パスワードの受け取り
    const password = req.body.password;
    try {
      // パスワードの暗号化
      const encryptedPassword = encrypt(password);
      // ユーザー新規登録
      const user = await User.create({
        name: req.body.name,
        password: encryptedPassword,
      });
      // JWTトークンの生成
      if (!process.env.SECRET_KEY_FOR_JWT_TOKEN) {
        throw new Error("JWTトークンの生成に失敗しました");
      }
      const token = jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY_FOR_JWT_TOKEN,
        {
          expiresIn: "24h",
        },
      );
      return res.status(200).send({ user, token });
    } catch (error) {
      console.log("ユーザー登録エラー", error);
      return res.status(500).send("ユーザー登録に失敗しました");
    }
  },
);
// ユーザーログイン用API

// listen
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

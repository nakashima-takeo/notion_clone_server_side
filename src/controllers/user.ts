import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { encrypt } from "../helper/aes.js";
import User from "../models/user.js";

const register = async (req: Request, res: Response) => {
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
};

export default register;

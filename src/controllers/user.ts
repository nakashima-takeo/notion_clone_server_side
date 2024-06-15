import { Request, Response } from "express";
import { encrypt, decrypt } from "../helper/aes.js";
import User from "../models/user.js";
import JWT from "../helper/jwt.js";

// ユーザー登録
export const register = async (req: Request, res: Response) => {
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
    const token = JWT.genarate(user._id);

    return res.status(201).send({ user, token });
  } catch (error) {
    console.log("ユーザー登録エラー", error);
    return res.status(500).send("ユーザー登録に失敗しました");
  }
};

// ログイン
export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  try {
    // DBからユーザーが存在するか探してくる
    const user = await User.findOne({ name: name });
    if (!user) {
      return res.status(401).json({
        errors: {
          param: "name",
          message: "ユーザー名が無効です。",
        },
      });
      return;
    }

    // パスワードの照合を行う
    if (decrypt(user.password) !== password) {
      return res.status(401).json({
        errors: {
          param: "password",
          message: "パスワードが無効です。",
        },
      });
    }

    // JWTの発行
    const token = JWT.genarate(user._id);

    return res.status(200).json({ user, token });
  } catch (error) {
    console.log("ログインエラー", error);
    return res.status(500).send("ログインに失敗しました。");
  }
};

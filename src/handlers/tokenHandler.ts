import JWT from "../helper/jwt.js";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.js";
import { JwtPayload } from "jsonwebtoken";

// JWTトークンを検証するためのミドルウェア
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokenDecoded = tokenDecode(req);
  // トークンが適切ではない場合
  if (!tokenDecoded) {
    return res.status(401).json("権限がありません。");
  }
  // トークンに紐づくユーザーを取得
  const user = await User.findById(tokenDecoded.id);
  // トークンに紐づくユーザーが存在しない場合
  if (!user) {
    return res.status(401).json("権限がありません。");
  }

  req.user = user;
  next();
};

const tokenDecode = (req: Request): JwtPayload | null => {
  const bearerHeader = req.get("authorization");
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ")[1];
    try {
      return JWT.verify(bearer);
    } catch {
      return null;
    }
  } else {
    return null;
  }
};

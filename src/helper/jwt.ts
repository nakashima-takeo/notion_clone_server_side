import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

// staticなクラスとして実装する
export default class JWT {
  private static secret: string;
  static {
    const secret = process.env.SECRET_KEY_FOR_JWT_TOKEN;
    if (!secret) {
      throw new Error("Secretが設定されていません。");
    }
    this.secret = secret;
  }

  static genarate(userId: Types.ObjectId): string {
    return jwt.sign({ id: userId }, JWT.secret, {
      expiresIn: "24h",
    });
  }

  static verify(bearer: string): JwtPayload {
    const JwtPayload = jwt.verify(bearer, this.secret);
    if (typeof JwtPayload === "string") {
      throw new Error("JWT is String");
    }
    return JwtPayload;
  }
}

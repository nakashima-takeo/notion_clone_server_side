import crypto from "crypto";

const key = process.env.SECRET_KEY_FOR_AES;
const iv = process.env.SECRET_IV_FOR_AES;

if (!key || !iv) {
  throw new Error("暗号化キーが設定されていません");
}

// 暗号化
export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// 復号化
export const decrypt = (text: string) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

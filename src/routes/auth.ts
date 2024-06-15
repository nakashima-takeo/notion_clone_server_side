import { Router, Request, Response } from "express";
import User from "../models/user.js";
import { body } from "express-validator";
import validation from "../handlers/validation.js";
import { register, login } from "../controllers/user.js";
import { verifyToken } from "../handlers/tokenHandler.js";

const router = Router();

// ユーザー新規登録API
router.post(
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
  validation,
  register,
);

// ログインAPI
router.post(
  "/login",
  // バリデーション
  body("name").isString().withMessage("ユーザー名を入力してください"),
  body("password").isString().withMessage("パスワードを入力してください"),
  validation,
  login,
);

// JWT認証API
router.post("/verify-token", verifyToken, (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
});

export default router;

import { Router } from "express";
import User from "../models/user.js";
import { body } from "express-validator";
import validation from "../handlers/validation.js";
import userContoroller from "../controllers/user.js";

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
  userContoroller,
);

export default router;

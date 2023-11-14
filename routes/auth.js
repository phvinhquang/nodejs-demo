const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Không được để trống trường nào")
      .isEmail()
      .withMessage("Hãy nhập đúng cấu trúc email")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("Không tìm thấy email này, hãy thử lại");
          }
        });
      })
      .normalizeEmail(),
    check("password", "Password invalid")
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Không được để trống trường nào")
      .isEmail()
      .withMessage("Nhập cho đúng vào")
      .custom((value, { req }) => {
        // Validation logic. For exampple
        // if (value === "test@test.com") {
        //   throw new Error("Đ được");
        //   //Hoặc return false
        // }
        // Nếu không có lỗi thì return true
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists, try another");
          }
        });
      })
      .normalizeEmail(),
    //Text thứ 2 là error mess sẽ hiển thị cho mọi validator
    body("password", "Password cần có ít nhất 9 kí tự, chỉ gồm chữ và số")
      .isLength({ min: 9 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match !");
      }

      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;

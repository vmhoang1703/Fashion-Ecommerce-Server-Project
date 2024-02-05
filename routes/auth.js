const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const AuthService = require("../services/AuthService");

const authService = new AuthService();

const handleErrors = (res, error, defaultMessage = "Lỗi server") => {
  console.error("Lỗi:", error.message);
  res.status(500).json({ message: defaultMessage });
};

router.post("/signup", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!hashedPassword) {
      return res.status(400).json({ message: "Mật khẩu không hợp lệ" });
    }

    const newUser = new User({ fullname, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    handleErrors(res, error, "Lỗi đăng ký");
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.authenticate(email, password);

    if (user) {
      const token = authService.generateToken(user);
      res.status(200).json({ token, user });
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    handleErrors(res, error, "Lỗi đăng nhập");
  }
});

router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token không được cung cấp" });
    }

    const decoded = authService.verifyToken(token);

    if (decoded) {
      const user = await User.findById(decoded.userId);
      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "Token không hợp lệ" });
    }
  } catch (error) {
    handleErrors(res, error, "Lỗi lấy thông tin người dùng");
  }
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const AuthService = require("../services/AuthService");

const authService = new AuthService();

router.post("/signup", async (req, res) => {
  try {
    const fullname = req.body.fullname;
    const email = req.body.email;
    var password = req.body.password;

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({ fullname, email, password });

    // Lưu người dùng vào MongoDB
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Xác thực người dùng
    const user = await authService.authenticate(email, password);

    if (user) {
      // Đăng nhập thành công, tạo token
      const token = authService.generateToken(user);

      // Gửi token và thông tin người dùng về client
      res.status(200).json({ token, user });
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
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
    console.error("Lỗi lấy thông tin người dùng:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

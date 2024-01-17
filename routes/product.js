const express = require("express");
const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/best-seller", async (req, res) => {
  try {
    const products = await Product.find().sort({ sold: -1 }).limit(6);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm bán chạy:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    res.status(200).json({ product });
  } catch (error) {
    console.error("Lỗi lấy thông tin sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

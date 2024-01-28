const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const { route } = require("./auth");

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

router.get("/products-by-collection/:id", async (req, res) => {
  try {
    const collectionId = req.params.id;
    const products = await Product.find({ collectionId: collectionId });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// router.post("/create-images", async (req, res) => {
//   try {
//     const { imageUrls, mainImageUrl } = req.body;
//     const productImage = new ProductImage({ imageUrls, mainImageUrl });
//     await productImage.save();
//     res
//       .status(201)
//       .json({ message: "Tạo ảnh sản phẩm thành công", productImage });
//   } catch (error) {
//     console.error("Lỗi tạo ảnh sản phẩm:", error.message);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// });

// router.get("/images/:id", async (req, res) => {
//   try {
//     const productImageId = req.params.id;
//     const productImage = await ProductImage.findById(productImageId);
//     res.status(200).json({ productImage });
//   } catch (error) {
//     console.error("Lỗi lấy ảnh sản phẩm:", error.message);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// });

router.post("/create", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      sold,
      collectionId,
      imageUrls,
      mainImageUrl,
    } = req.body;
    const product = new Product({
      name,
      description,
      price,
      quantity,
      sold,
      collectionId,
      imageUrls, 
      mainImageUrl,
    });
    await product.save();
    res.status(201).json({ message: "Tạo sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    await Product.findByIdAndUpdate(productId, {
      ...req.body,
    });

    res.status(200).json({ message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

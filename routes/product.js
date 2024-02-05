const express = require("express");
const router = express.Router();

const Product = require("../models/product");
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
      size,
      material,
      color,
      brand,
      favoriteCount
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
      size,
      material,
      color,
      brand,
      favoriteCount
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
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      collectionId: req.body.collectionId,
      imageUrls: req.body.imageUrls,
      mainImageUrl: req.body.mainImageUrl,
      size: req.body.size,
      material: req.body.material,
      color: req.body.color,
      brand: req.body.brand,
      favoriteCount: req.body.favoriteCount
    });

    res.status(200).json({ message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/filter", async (req, res) => {
  try {
    let filter = {};

    // Áp dụng điều kiện sắp xếp (sortBy)
    const sortBy = req.body.sortBy;
    let sortOptions = {};
    if (sortBy === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === "newest") {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === "bestseller") {
      sortOptions = { sold: -1 };
    }

    // Áp dụng điều kiện giá (minPrice và maxPrice)
    const minPrice = req.body.priceRange[0];
    const maxPrice = req.body.priceRange[1];
    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice * 1000, $lte: maxPrice * 1000 };
    }

    // Áp dụng điều kiện danh mục (collections)
    const collections = req.body.collections;
    if (collections && collections.length > 0) {
      filter.collectionId = { $in: collections };
    }

    // Áp dụng điều kiện tồn kho (inStock và outOfStock)
    if (req.body.inStock) {
      filter.quantity = { $gt: 0 };
    }

    if (req.body.outOfStock) {
      filter.quantity = { $eq: 0 };
    }

    if (req.body.inStock && req.body.outOfStock) {
      filter.quantity = { $gte: 0 };
    }

    const productsFiltered = await Product.find(filter).sort(sortOptions);

    res
      .status(200)
      .json({ message: "Lọc sản phẩm thành công", productsFiltered });
  } catch (error) {
    console.error("Lỗi lọc sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const Collection = require("../models/collection");

router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json({ collections });
  } catch (error) {
    console.error("Lỗi lấy danh sách bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const collection = await Collection.findById(id);
    res.status(200).json({ collection });
  } catch (error) {
    console.error("Lỗi lấy bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// router.get("/image/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const collection = await Collection.findById(id);
//     // Send image file to client
//     res.sendFile(path.join(__dirname, "../", collection.imageUrl));
//   } catch (error) {
//     console.error("Lỗi lấy ảnh bộ sưu tập:", error.message);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// });

router.post("/create", async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const collection = new Collection({ title, description, imageUrl });
    await collection.save();
    res.status(201).json({ message: "Tạo bộ sưu tập thành công" });
  } catch (error) {
    console.error("Lỗi tạo bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Collection.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa bộ sưu tập thành công" });
  } catch (error) {
    console.error("Lỗi xóa bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const collectionId = req.params.id;

    await Collection.findByIdAndUpdate(collectionId, {
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Lỗi cập nhật bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

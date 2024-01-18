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
    collections.forEach((collection) => {
      collection.imageUrl = undefined;
    });
    res.status(200).json({ collections });
  } catch (error) {
    console.error("Lỗi lấy danh sách bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/image/:id", async (req, res) => {
  try {
    const collectionId = req.params.id;
    const collection = await Collection.findById(collectionId);
    // Send image file to client
    res.sendFile(path.join(__dirname, "../", collection.imageUrl));
  } catch (error) {
    console.error("Lỗi lấy ảnh bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = path.join("assets/uploads", req.file.originalname);

    const collection = new Collection({
      title: title,
      description: description,
      imageUrl: imageUrl,
    });

    await collection.save();

    res.status(201).json({ message: "Tạo bộ sưu tập thành công" });
  } catch (error) {
    console.error("Lỗi tạo bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const collectionId = req.params.id;
    await Collection.findByIdAndDelete(collectionId);
    res.status(200).json({ message: "Xóa bộ sưu tập thành công" });
  } catch (error) {
    console.error("Lỗi xóa bộ sưu tập:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;

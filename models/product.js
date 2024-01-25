const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  collectionId: {
    type: String,
    require: true,
  },
  mainImageUrl: {
    type: String,
    require: true,
  },
  otherImageUrls: {
    type: [String],
    default: [],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

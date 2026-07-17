const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  description: String,
});
module.exports = mongoose.model("Product", ProductSchema);

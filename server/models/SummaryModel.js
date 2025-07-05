// models/DailySummary.js
const mongoose = require("mongoose");

const dailySummarySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  date: String, // e.g., "2025-07-04"
  views: Number,
  carts: Number,
  wishlists: Number
});

module.exports = mongoose.model("DailySummary", dailySummarySchema);

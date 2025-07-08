// server/models/DailySummary.js
const mongoose = require("mongoose");

const dailySummarySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  carts: {
    type: Number,
    default: 0
  },
  wishlists: {
    type: Number,
    default: 0
  },
  purchases:{
    type:Number,
    default:0
  },
  cost:{
    type:Number,
    default:0
  }
});

dailySummarySchema.index({ productId: 1, date: 1 }, { unique: true }); // prevent duplicates

module.exports = mongoose.model("DailySummary", dailySummarySchema);

// models/EventLog.js
const mongoose = require("mongoose");

const eventLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  eventType: {
    type: String,
    enum: ["view", "cart", "wishlist"],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("EventLog", eventLogSchema);

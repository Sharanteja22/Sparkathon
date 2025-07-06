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
  sessionId: {
    type: String,
    required: true
  },
  device: {
    type: String,
    enum: ["web", "mobile", "tablet"],
    default: "web"
  },
  location: {
    country: String,
    city: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("EventLog", eventLogSchema);
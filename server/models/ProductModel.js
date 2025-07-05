// server/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: String,
  category: String,

  actualPrice: {
    type: Number,
    required: true
  },
  offerPrice: {
    type: Number
  },

  available: {
    type: Boolean,
    default: true
  },

  image: {
    type: String,
    default: ""
  },

  rating: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Product", productSchema);

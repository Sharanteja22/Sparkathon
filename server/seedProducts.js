// server/seedProducts.js

const axios = require("axios");
const mongoose = require("mongoose");
const Product = require("./models/ProductModel");

require("dotenv").config(); // Make sure this is used to load your MongoDB URI

const MONGO_URI = process.env.MONGO_URI;

async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const response = await axios.get("https://dummyjson.com/products?limit=100");
    const products = response.data.products;

    const formattedProducts = products.map(p => ({
      name: p.title,
      brand: p.brand,
      category: p.category,
      actualPrice: p.price,
      offerPrice: Math.round(p.price * (1 - p.discountPercentage / 100)),
      available: p.stock > 0,
      image: p.thumbnail,
      rating: p.rating
    }));

    await Product.insertMany(formattedProducts);
    console.log("✅ Products inserted successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    mongoose.disconnect();
  }
}

seedProducts();

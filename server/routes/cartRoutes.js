const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product"); // Optional for population

// 🛒 GET: Fetch user's cart
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart.productId");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// 🛒 POST: Add or update product in cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if product already in cart
    const existingItem = user.cart.find(item => item.productId.toString() === productId);

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: "Cart updated successfully", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// 🗑️ POST: Remove product from cart
router.post("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);

    await user.save();
    res.status(200).json({ message: "Item removed", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

module.exports = router;

  // server/routes/admin.js
  const express = require("express");
  const router = express.Router();
  const aggregateDailySummary = require("../utils/aggregateDailySummary");
  const Product = require("../models/ProductModel");
  const DailySummary = require("../models/DailySummary");
  // Optional: You can add auth middleware to restrict admin-only access
  router.post("/aggregate-summary", async (req, res) => {
    try {
      await aggregateDailySummary();
      res.json({ message: "Summary aggregation successful!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Aggregation failed" });
    }
  });



  router.get("/daily-summary", async (req, res) => {
  try {
    const summary = await DailySummary.find({})
      .populate("productId", "name actualPrice")  // populate just product name
      .sort({ date: 1 });

    res.json(summary);
  } catch (err) {
    console.error("❌ Failed to fetch daily summary:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});
  module.exports = router;

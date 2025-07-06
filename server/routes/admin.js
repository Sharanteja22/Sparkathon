  // server/routes/admin.js
  const express = require("express");
  const router = express.Router();
  const aggregateDailySummary = require("../utils/aggregateDailySummary");

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

  module.exports = router;

// POST /api/logs
const express = require("express");
const Log = require("../models/EventlogModel");
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, productId, eventType } = req.body;
  if (!userId || !productId || !eventType) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const log = new Log({
      userId,
      productId,
      eventType, // 'viewed' | 'added_to_cart' | 'wishlisted'
      timestamp: new Date(),
    });

    await log.save();
    res.status(201).json({ message: "Log saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

// GET /api/trends/:productId
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const trends = await Log.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: {
            eventType: "$eventType",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.eventType",
          data: {
            $push: {
              date: "$_id.date",
              count: "$count"
            }
          }
        }
      }
    ]);

    res.status(200).json(trends);
  } catch (err) {
    res.status(500).json({ error: "Trend fetch failed" });
  }
});



module.exports = router;
// server/utils/aggregateDailySummary.js
const EventLog = require("../models/EventlogModel");
const DailySummary = require("../models/DailySummary");
const moment = require("moment");

const aggregateDailySummary = async () => {
  try {

    // const yesterday = moment().subtract(1, "days").startOf("day").toDate();
    // const today = moment().startOf("day").toDate();
    // const dateString = moment(yesterday).format("YYYY-MM-DD");
    const yesterday = moment().startOf("day").toDate();       // today 00:00
    const today = new Date();                               // now

    const dateString = moment().format("YYYY-MM-DD");

    const aggregation = await EventLog.aggregate([
      {
        $match: {
          timestamp: {
            $gte: yesterday,
            $lt: today
          }
        }
      },
      {
        $group: {
          _id: {
            productId: "$productId",
            eventType: "$eventType"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const summaryMap = {};

    aggregation.forEach(({ _id, count }) => {
      const { productId, eventType } = _id;
      if (!summaryMap[productId]) {
        summaryMap[productId] = { views: 0, carts: 0, wishlists: 0 };
      }

      if (eventType === "view") summaryMap[productId].views += count;
      else if (eventType === "cart") summaryMap[productId].carts += count;
      else if (eventType === "wishlist") summaryMap[productId].wishlists += count;
    });

    for (const productId in summaryMap) {
      const summary = summaryMap[productId];
      await DailySummary.findOneAndUpdate(
        { productId, date: dateString },
        { ...summary, productId, date: dateString },
        { upsert: true, new: true }
      );
    }
    // Inside aggregateDailySummary.js (optional extension)
    const zscore = (values) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
    return values.map((val) => ((val - mean) / std).toFixed(2));
    };


    console.log("✅ Daily summary aggregated for:", dateString);
  } catch (err) {
    console.error("❌ Error aggregating daily summary:", err);
  }
};

module.exports = aggregateDailySummary;

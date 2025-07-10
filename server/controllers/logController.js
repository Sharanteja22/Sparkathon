// server/controllers/logController.js
const EventLog = require("../models/EventlogModel");

exports.logUserEvent = async (req, res) => {
  try {
    const {
      productId,
      userId,
      eventType,
      sessionId,
      device,
      cost,
      location
    } = req.body;
    // console.log(req.body);

    if (!productId || !userId || !eventType || !sessionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newLog = new EventLog({
      productId,
      userId,
      eventType,
      sessionId,
      device: device || "web",
      location,
      cost
    });

    await newLog.save();
    res.status(201).json({ message: "Event logged successfully" });
    console.log("Event logged successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Logging failed" });
  }
};

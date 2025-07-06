// server/routes/logRoutes.js
const express = require("express");
const router = express.Router();
const { logUserEvent } = require("../controllers/logController");

router.post("/event", logUserEvent);

module.exports = router;

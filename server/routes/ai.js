const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/predict-insight", async (req, res) => {
  const { productName, date, views, carts, wishlists } = req.body;

  // Amplify values to simulate more realistic input
  const amplifiedViews = views * 10011;
  const amplifiedCarts = carts * 1118;
  const amplifiedWishlists = wishlists * 672;

//   console.log(amplifiedViews, amplifiedCarts, amplifiedWishlists);

  const prompt = `
Given the following product engagement:
- Product: ${productName}
- Date: ${date}
- Views: ${amplifiedViews}
- Carts: ${amplifiedCarts}
- Wishlists: ${amplifiedWishlists}


Assume that average product metrics are:
- Views: 3000
- Carts: 300
- Wishlists: 100

Compare the product against these averages and:

Predict:
1. Overall trend (growing/stable/declining)
2. Is there a spike? (true/false)
3. Spike magnitude (0 if none)
4. Suggested actions (3)

Respond in JSON format like:
{
  "predictedTrend": "growing",
  "spikeDetected": true,
  "spikeMagnitude": 2.5,
  "actions": ["Restock", "Increase Ads", "Highlight on Homepage"]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message.content;
    const json = JSON.parse(text);
    res.json(json);
  } catch (err) {
    console.error("🧠 AI Error:", err.message);
    res.status(500).json({ error: "AI processing failed" });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const logRoutes = require("./routes/logRoutes");
const adminRoutes = require("./routes/admin");

const productRoutes = require("./routes/productRoutes");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get('/', (req, res) => res.send('API running 🚀'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use("/api/logs", logRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api", authRoutes);
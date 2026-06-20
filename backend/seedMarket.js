require("dotenv").config();
const mongoose = require("mongoose");
const MarketPrice = require("./models/MarketPrice");
const marketData = require("./data/marketData.json");

mongoose.connect(process.env.MONGODB_URI);

async function seed() {
  await MarketPrice.deleteMany({});
  await MarketPrice.insertMany(marketData);

  console.log(`✅ Inserted ${marketData.length} records`);
  process.exit();
}

seed();
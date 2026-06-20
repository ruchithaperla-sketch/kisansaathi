require("dotenv").config();
const mongoose = require("mongoose");
const MarketPrice = require("./models/MarketPrice");

async function updatePrices() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected");

    const records = await MarketPrice.find();

    console.log(`Found ${records.length} records`);

    for (const item of records) {
      const variation = Math.floor(Math.random() * 201) - 100;

      item.pricePerQtl = Math.max(
        100,
        item.pricePerQtl + variation
      );

      item.lastUpdated = new Date();

      await item.save();
    }

    console.log("✅ Market prices updated");

    await mongoose.connection.close();

    process.exit(0);

  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

updatePrices();
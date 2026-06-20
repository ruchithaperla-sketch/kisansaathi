const mongoose = require("mongoose");

const MarketPriceSchema = new mongoose.Schema({
  state: String,
  crop: String,
  pricePerQtl: Number,
  market: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "MarketPrice",
  MarketPriceSchema
);
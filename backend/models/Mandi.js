const mongoose = require("mongoose");

const mandiSchema = new mongoose.Schema({
  state: String,
  district: String,
  mandiName: String,
  address: String
});

module.exports = mongoose.model("Mandi", mandiSchema);;
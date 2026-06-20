const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  state: String,
  name: String,
  description: String,
  category: String,
  benefit: String,
  eligibility: String,
  deadline: String
});

module.exports = mongoose.model("Scheme", schemeSchema);
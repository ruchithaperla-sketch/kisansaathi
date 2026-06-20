require("dotenv").config();
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");

mongoose.connect(process.env.MONGODB_URI);
async function seed() {

await Scheme.insertMany([

  {
    state: "Andhra Pradesh",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },
  {
    state: "Andhra Pradesh",
    name: "Annadata Sukhibhava",
    description: "State farmer support and financial assistance program",
    category: "Income Support",
    benefit: "Financial assistance",
    eligibility: "Eligible farmers",
    deadline: "Ongoing"
  },

  {
    state: "Telangana",
    name: "Rythu Bharosa",
    description: "Investment support for farmers",
    category: "Income Support",
    benefit: "Direct financial support",
    eligibility: "Eligible farmers",
    deadline: "Ongoing"
  },
  {
    state: "Telangana",
    name: "Rythu Bima",
    description: "Life insurance scheme for farmers",
    category: "Insurance",
    benefit: "Insurance coverage",
    eligibility: "Registered farmers",
    deadline: "Ongoing"
  },

  {
    state: "Maharashtra",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },
  {
    state: "Maharashtra",
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme",
    category: "Insurance",
    benefit: "Crop loss compensation",
    eligibility: "Farmers",
    deadline: "Seasonal"
  },

  {
    state: "Punjab",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },
  {
    state: "Punjab",
    name: "Soil Health Card Scheme",
    description: "Provides soil testing and nutrient recommendations",
    category: "Soil Health",
    benefit: "Free soil assessment",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },

  {
    state: "Haryana",
    name: "Meri Fasal Mera Byora",
    description: "Farmer registration and crop information platform",
    category: "Market",
    benefit: "Access to government benefits",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },
  {
    state: "Haryana",
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme",
    category: "Insurance",
    benefit: "Crop loss compensation",
    eligibility: "Farmers",
    deadline: "Seasonal"
  },

  {
    state: "Uttar Pradesh",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },
  {
    state: "Uttar Pradesh",
    name: "Kisan Credit Card",
    description: "Provides affordable agricultural credit",
    category: "Credit",
    benefit: "Low-interest loans",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },

  {
    state: "Madhya Pradesh",
    name: "Mukhyamantri Kisan Kalyan Yojana",
    description: "Farmer welfare and financial assistance scheme",
    category: "Income Support",
    benefit: "Financial assistance",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },
  {
    state: "Madhya Pradesh",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },

  {
    state: "Rajasthan",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },
  {
    state: "Rajasthan",
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme",
    category: "Insurance",
    benefit: "Crop loss compensation",
    eligibility: "Farmers",
    deadline: "Seasonal"
  },

  {
    state: "Gujarat",
    name: "iKhedut",
    description: "Agricultural subsidy and farmer assistance platform",
    category: "Market",
    benefit: "Subsidies and support",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },
  {
    state: "Gujarat",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },

  {
    state: "Karnataka",
    name: "Raitha Siri",
    description: "Farmer support initiative",
    category: "Income Support",
    benefit: "Financial support",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },
  {
    state: "Karnataka",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },

  {
    state: "Tamil Nadu",
    name: "Uzhavar Pathukappu Thittam",
    description: "Farmer welfare and security scheme",
    category: "Insurance",
    benefit: "Financial protection",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },
  {
    state: "Tamil Nadu",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },

  {
    state: "Kerala",
    name: "Karshaka Kshema Nidhi",
    description: "Farmer welfare fund scheme",
    category: "Income Support",
    benefit: "Pension and welfare benefits",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },
  {
    state: "Kerala",
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme",
    category: "Insurance",
    benefit: "Crop loss compensation",
    eligibility: "Farmers",
    deadline: "Seasonal"
  },

  {
    state: "Bihar",
    name: "Bihar Rajya Fasal Sahayata Yojana",
    description: "Crop assistance scheme",
    category: "Insurance",
    benefit: "Financial support during crop loss",
    eligibility: "Farmers",
    deadline: "Seasonal"
  },
  {
    state: "Bihar",
    name: "PM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "₹6000 per year",
    eligibility: "Eligible farmer families",
    deadline: "Ongoing"
  },

  {
    state: "West Bengal",
    name: "Krishak Bandhu",
    description: "Farmer income support scheme",
    category: "Income Support",
    benefit: "Financial assistance",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },
  {
    state: "West Bengal",
    name: "Bangla Shasya Bima",
    description: "Crop insurance scheme",
    category: "Insurance",
    benefit: "Crop loss compensation",
    eligibility: "Farmers",
    deadline: "Seasonal"
  },

  {
    state: "Odisha",
    name: "KALIA Yojana",
    description: "Farmer livelihood and income support scheme",
    category: "Income Support",
    benefit: "Financial assistance",
    eligibility: "Farmers",
    deadline: "Ongoing"
  },
  {
    state: "Odisha",
    name: "CM-KISAN",
    description: "Income support scheme for farmers",
    category: "Income Support",
    benefit: "Financial assistance",
    eligibility: "Farmers",
    deadline: "Ongoing"
  }

]);

  console.log("✅ Schemes inserted");
  process.exit();
}

seed();
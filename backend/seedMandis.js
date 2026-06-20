require("dotenv").config();

const mongoose = require("mongoose");
const Mandi = require("./models/Mandi");

async function seedMandis() {
  try {

    await mongoose.connect(process.env.MONGODB_URI);

    await Mandi.deleteMany({});

    await Mandi.insertMany([

      // Andhra Pradesh

      {
        state: "Andhra Pradesh",
        district: "Visakhapatnam",
        mandiName: "Anakapalle Market Yard",
        address: "Anakapalle, Andhra Pradesh"
      },
      {
        state: "Andhra Pradesh",
        district: "Visakhapatnam",
        mandiName: "Rythu Bazaar MVP Colony",
        address: "MVP Colony, Visakhapatnam"
      },
      {
        state: "Andhra Pradesh",
        district: "Visakhapatnam",
        mandiName: "Rythu Bazaar Gajuwaka",
        address: "Gajuwaka, Visakhapatnam"
      },
      {
        state: "Andhra Pradesh",
        district: "Guntur",
        mandiName: "Guntur Market Yard",
        address: "Guntur, Andhra Pradesh"
      },
      {
        state: "Andhra Pradesh",
        district: "Guntur",
        mandiName: "Guntur Mirchi Yard",
        address: "Guntur, Andhra Pradesh"
      },

      // Telangana

      {
        state: "Telangana",
        district: "Hyderabad",
        mandiName: "Bowenpally Market",
        address: "Hyderabad, Telangana"
      },
      {
        state: "Telangana",
        district: "Hyderabad",
        mandiName: "Gudimalkapur Market",
        address: "Hyderabad, Telangana"
      },

      // Maharashtra

      {
        state: "Maharashtra",
        district: "Nashik",
        mandiName: "Lasalgaon APMC",
        address: "Lasalgaon, Maharashtra"
      },
      {
        state: "Maharashtra",
        district: "Nashik",
        mandiName: "Nashik APMC",
        address: "Nashik, Maharashtra"
      },
      {
        state: "Maharashtra",
        district: "Pune",
        mandiName: "Pune APMC",
        address: "Pune, Maharashtra"
      },

      // Punjab

      {
        state: "Punjab",
        district: "Ludhiana",
        mandiName: "Ludhiana Grain Market",
        address: "Ludhiana, Punjab"
      },
      {
        state: "Punjab",
        district: "Khanna",
        mandiName: "Khanna Grain Market",
        address: "Khanna, Punjab"
      },

      // Karnataka

      {
        state: "Karnataka",
        district: "Bengaluru",
        mandiName: "Yeshwanthpur APMC",
        address: "Bengaluru, Karnataka"
      },

      // Tamil Nadu

      {
        state: "Tamil Nadu",
        district: "Chennai",
        mandiName: "Koyambedu Market",
        address: "Chennai, Tamil Nadu"
      },

      // Kerala

      {
        state: "Kerala",
        district: "Kochi",
        mandiName: "Kochi Market Yard",
        address: "Kochi, Kerala"
      },

      // Rajasthan

      {
        state: "Rajasthan",
        district: "Kota",
        mandiName: "Kota Mandi",
        address: "Kota, Rajasthan"
      }

    ]);

    console.log("✅ Mandis inserted");

    process.exit();

  } catch (err) {

    console.error(err);

    process.exit(1);
  }
}

seedMandis();
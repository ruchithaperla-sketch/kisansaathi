require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MarketPrice = require("./models/MarketPrice");
const Scheme = require("./models/Scheme");
const mongoose = require("mongoose");
const Notification = require("./models/Notification");



const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://kisansaathi-g0o8h1nnu-ruchithaperla-9570s-projects.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options(/.*/, cors());
app.use(express.json({ limit: "10mb" }));

const GROQ_KEY = process.env.GROQ_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

if (!GROQ_KEY) { console.error("❌ GROQ_KEY missing"); process.exit(1); }
if (!JWT_SECRET) { console.error("❌ JWT_SECRET missing"); process.exit(1); }

// ── Connect MongoDB ──────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => { console.error("❌ MongoDB error:", err.message); process.exit(1); });

// ── User Schema ──────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  state:        { type: String, required: true },
  mainCrop:     { type: String, required: true },
  role:         { type: String, default: "farmer" }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);

// ── Auth Middleware ──────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid or expired token." });
  }
}

// ── Register ─────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, state, mainCrop } = req.body;
    if (!fullName || !email || !password || !state || !mainCrop)
      return res.status(400).json({ error: "All fields are required." });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match." });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: "Email already registered." });

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await User.create({
  fullName,
  email,
  passwordHash,
  state,
  mainCrop,
  role: email.toLowerCase() === "admin@kisansaathi.com" ? "admin" : "farmer"
});

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, fullName: newUser.fullName },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      token,
      user: {
  id: newUser._id,
  fullName,
  email: newUser.email,
  state,
  mainCrop,
  role: newUser.role
}
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Registration failed." });
  }
});

// ── Login ─────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = jwt.sign(
      { id: user._id, email: user.email, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: rememberMe ? "30d" : "7d" }
    );
    res.json({
      token,
      user: {
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  state: user.state,
  mainCrop: user.mainCrop,
  role: user.role
}
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed." });
  }
});


app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch users"
    });
  }
});
app.delete("/api/admin/users/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted"
    });

  } catch (err) {

    res.status(500).json({
      error: "Delete failed"
    });

  }
});


// ── Get Me ────────────────────────────────────────────────────────
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user: {
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  state: user.state,
  mainCrop: user.mainCrop,
  role: user.role
} });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user." });
  }
});
// ── Market Prices ─────────────────────────────

app.get("/api/market-prices", async (req, res) => {
  try {

    const state = req.query.state;

    const prices = await MarketPrice.find({ state });

    res.json(prices);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch market prices"
    });

  }
});

// ── Admin Update Market Price ─────────────────────────

app.put("/api/admin/market-price/:id", async (req, res) => {
  try {
    const { pricePerQtl } = req.body;

    const updated = await MarketPrice.findByIdAndUpdate(
      req.params.id,
      { pricePerQtl },
      { new: true }
    );

    res.json(updated);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to update price"
    });

  }
});

app.post("/api/admin/market-price", async (req, res) => {
  try {
    const { crop, market, state, pricePerQtl } = req.body;

    const item = await MarketPrice.create({
      crop,
      market,
      state,
      pricePerQtl,
      lastUpdated: new Date()
    });

    res.json(item);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create price"
    });
  }
});
app.delete("/api/admin/market-price/:id", async (req, res) => {
  try {
    await MarketPrice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Price deleted"
    });
  } catch (err) {
    res.status(500).json({
      error: "Delete failed"
    });
  }
});

// ── Schemes──────────────────────────────────────────────────────────
app.get("/api/schemes", async (req, res) => {
  try {
    const { state } = req.query;

    const schemes = state
      ? await Scheme.find({ state })
      : await Scheme.find();

    res.json(schemes);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
app.post("/api/admin/schemes", async (req, res) => {
  try {

    const scheme = await Scheme.create(req.body);

    res.json(scheme);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to create scheme"
    });

  }
});

app.delete("/api/admin/schemes/:id", async (req, res) => {
  try {

    await Scheme.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      error: "Delete failed"
    });

  }
});
const Mandi = require("./models/Mandi");

app.get("/api/mandis", async (req, res) => {
  try {

    const state = req.query.state;

    const mandis = await Mandi.find({
    state: state
  });
    res.json(mandis);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch mandis"
    });

  }
});



// ── Chat ──────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim())
      return res.status(400).json({ error: "Prompt is required." });

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt.trim() }],
        max_tokens: 300,
      },
      { headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" } }
    );
    res.json({ text: response.data.choices[0].message.content });
  } catch (err) {
    console.error("GROQ ERROR:\n", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.error?.message || "Groq API call failed." });
  }
});

// ── Analyze Image ─────────────────────────────────────────────────
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { image, query } = req.body;
    if (!image || !image.startsWith("data:image/"))
      return res.status(400).json({ error: "A valid base64 image is required." });

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: image } },
            { type: "text", text: `You are a plant pathologist. Analyze this crop/plant image. ${query ? `Farmer says: ${query}.` : ""} Identify: 1) Disease name 2) Cause 3) Severity 4) Treatment 5) Prevention. Be specific for Indian farmers.` }
          ]
        }],
        max_tokens: 100,
      },
      { headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" } }
    );
    res.json({ text: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Image analysis error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.error?.message || "Image analysis failed." });
  }
});

app.get("/api/crops", async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch crops"
    });
  }
});

app.post("/api/admin/crops", async (req, res) => {
  try {
    const crop = await Crop.create(req.body);

    res.json(crop);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create crop"
    });
  }
});


app.delete("/api/admin/crops/:id", async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      error: "Delete failed"
    });
  }
});

// Get Notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications =
      await Notification.find()
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Create Notification
app.post("/api/admin/notifications", async (req, res) => {
  try {

    const notification =
      await Notification.create(req.body);

    res.json(notification);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

// Delete Notification
app.delete(
  "/api/admin/notifications/:id",
  async (req, res) => {
    try {

      await Notification.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true
      });

    } catch (err) {

      res.status(500).json({
        error: err.message
      });

    }
  }
);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KisanSaathi Backend Running 🚀"
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`✅ KisanSaathi server running on port ${process.env.PORT || 3001}`);
  console.log(`GROQ KEY LOADED: ${!!GROQ_KEY}`);
});


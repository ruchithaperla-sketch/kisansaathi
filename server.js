
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
 
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
 
// ─── CONFIG ────────────────────────────────────────────────────────────────────
const GROQ_KEY = process.env.GROQ_KEY;
const JWT_SECRET =  process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
 
// ─── IN-MEMORY USER STORE (replace with MongoDB/PostgreSQL in production) ─────
// Structure: { email: { id, name, email, passwordHash, state, mainCrop, createdAt } }
const users = {};
 
// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
 
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
 
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}
 
// ─── AUTH ROUTES ───────────────────────────────────────────────────────────────
 
// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, state, mainCrop } = req.body;
 
    // Validation
    if (!name || !email || !password || !confirmPassword || !state || !mainCrop) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    if (users[email.toLowerCase()]) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
 
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
 
    // Store user
    const userId = `user_${Date.now()}`;
    users[email.toLowerCase()] = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      state,
      mainCrop,
      createdAt: new Date().toISOString()
    };
 
    // Generate token
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase(), name: name.trim() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
 
    console.log(`✅ New farmer registered: ${email}`);
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase(),
        state,
        mainCrop
      }
    });
 
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});
 
// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
 
    const user = users[email.toLowerCase()];
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
 
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
 
    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn }
    );
 
    console.log(`✅ Farmer logged in: ${email}`);
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        state: user.state,
        mainCrop: user.mainCrop
      }
    });
 
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});
 
// GET CURRENT USER (protected)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users[req.user.email];
  if (!user) return res.status(404).json({ error: 'User not found.' });
 
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    state: user.state,
    mainCrop: user.mainCrop,
    createdAt: user.createdAt
  });
});
 
// ─── EXISTING AI ROUTES (protected) ───────────────────────────────────────────
 
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000
      },
      { headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' } }
    );
    const text = response.data.choices[0].message.content;
    res.json({ text });
  } catch (err) {
    console.error("Chat ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});
 
app.post('/api/analyze-image', authenticateToken, async (req, res) => {
  try {
    const { image, query } = req.body;
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: image } },
            { type: "text", text: `You are a plant pathologist. Analyze this crop/plant image. ${query ? `Farmer says: ${query}.` : ''} Identify: 1) Disease name 2) Cause 3) Severity (Low/Medium/High) 4) Treatment steps 5) Prevention tips. Be practical and specific for Indian farmers.` }
          ]
        }],
        max_tokens: 1000
      },
      { headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' } }
    );
    const text = response.data.choices[0].message.content;
    res.json({ text });
  } catch (err) {
    console.error("Image ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Image analysis failed" });
  }
});
 
app.listen(3001, () => console.log('✅ KisanSaathi server running on port 3001'));
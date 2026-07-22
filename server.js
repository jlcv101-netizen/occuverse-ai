const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'public/uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Mock database
const users = {};
const chats = {};

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    if (users[email]) return res.status(400).json({ error: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();

    users[email] = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      profilePicture: null,
      createdAt: new Date()
    };

    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ success: true, token, user: { id: userId, username, email, profilePicture: null } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = users[email];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email, profilePicture: user.profilePicture } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile endpoints
app.post('/api/profile/upload', upload.single('profilePicture'), (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !users[email]) return res.status(404).json({ error: 'User not found' });
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    users[email].profilePicture = fileUrl;

    res.json({ success: true, profilePicture: fileUrl, user: { id: users[email].id, username: users[email].username, email: users[email].email, profilePicture: fileUrl } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profile/:email', (req, res) => {
  try {
    const { email } = req.params;
    const user = users[email];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, username: user.username, email: user.email, profilePicture: user.profilePicture, createdAt: user.createdAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoints
app.post('/api/chat', (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'Missing fields' });

    if (!chats[userId]) chats[userId] = [];

    const chatMessage = { id: Date.now(), role: 'user', content: message, timestamp: new Date() };
    chats[userId].push(chatMessage);

    const aiResponse = { id: Date.now() + 1, role: 'assistant', content: `Processing: ${message}`, timestamp: new Date() };
    chats[userId].push(aiResponse);

    res.json({ success: true, message: aiResponse, chatHistory: chats[userId] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chat/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const chatHistory = chats[userId] || [];
    res.json({ success: true, chatHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image generation
app.post('/api/generate-image', (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
    const mockImageUrl = `https://via.placeholder.com/512?text=${encodeURIComponent(prompt.substring(0, 50))}`;
    res.json({ success: true, imageUrl: mockImageUrl, prompt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Code generation
app.post('/api/generate-code', (req, res) => {
  try {
    const { description, language } = req.body;
    if (!description) return res.status(400).json({ error: 'Missing description' });
    const mockCode = `// ${description}\nfunction example() {\n  console.log('Generated code');\n  return 'Hello!';\n}\nexample();`;
    res.json({ success: true, code: mockCode, language: language || 'javascript' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OccuVerse AI is running' });
});

app.listen(PORT, () => {
  console.log(`OccuVerse AI Server running on port ${PORT}`);
});

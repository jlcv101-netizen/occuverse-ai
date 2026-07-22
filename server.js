const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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

// ==================== WEATHER API ====================

app.get('/api/weather', async (req, res) => {
  try {
    const { city, unit = 'metric' } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    // Using Open-Meteo API (free, no API key required)
    const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: city,
        count: 1,
        language: 'en',
        format: 'json'
      }
    });

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { latitude, longitude, name, country } = geoResponse.data.results[0];

    // Get weather data
    const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,cloud_cover,pressure_msl',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m_max,wind_speed_10m_max',
        timezone: 'auto',
        temperature_unit: unit === 'metric' ? 'celsius' : 'fahrenheit',
        wind_speed_unit: unit === 'metric' ? 'kmh' : 'mph'
      }
    });

    const current = weatherResponse.data.current;
    const daily = weatherResponse.data.daily;

    const getWeatherDescription = (code) => {
      const codes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy rime',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail'
      };
      return codes[code] || 'Unknown';
    };

    const currentWeather = {
      temp: current.temperature_2m,
      feelsLike: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      description: getWeatherDescription(current.weather_code),
      windSpeed: current.wind_speed_10m,
      pressure: Math.round(current.pressure_msl),
      visibility: 10000,
      clouds: current.cloud_cover
    };

    const forecast = [];
    if (daily.time) {
      for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        forecast.push({
          date: new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          tempMax: daily.temperature_2m_max[i],
          tempMin: daily.temperature_2m_min[i],
          description: getWeatherDescription(daily.weather_code[i]),
          humidity: daily.relative_humidity_2m_max[i],
          windSpeed: daily.wind_speed_10m_max[i]
        });
      }
    }

    res.json({
      location: `${name}, ${country}`,
      current: currentWeather,
      forecast
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// ==================== JOKES API ====================

app.get('/api/jokes/random', async (req, res) => {
  try {
    const { type = 'random' } = req.query;

    let jokeData;

    if (type === 'programming') {
      const response = await axios.get('https://official-joke-api.appspot.com/jokes/programming/random');
      jokeData = {
        setup: response.data.setup,
        punchline: response.data.delivery || response.data.punchline,
        type: 'programming',
        category: response.data.category
      };
    } else if (type === 'knock-knock') {
      const response = await axios.get('https://official-joke-api.appspot.com/jokes/knock-knock/random');
      jokeData = {
        setup: response.data.setup,
        punchline: response.data.delivery || response.data.punchline,
        type: 'knock-knock',
        category: response.data.category
      };
    } else if (type === 'general') {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      jokeData = {
        setup: response.data.setup,
        punchline: response.data.delivery || response.data.punchline,
        type: response.data.type,
        category: response.data.category
      };
    } else {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      jokeData = {
        setup: response.data.setup,
        punchline: response.data.delivery || response.data.punchline,
        type: response.data.type,
        category: response.data.category
      };
    }

    res.json(jokeData);
  } catch (error) {
    console.error('Jokes API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch joke. Please try again.' });
  }
});

// ==================== AUTH ENDPOINTS ====================

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

// ==================== PROFILE ENDPOINTS ====================

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

// ==================== CHAT ENDPOINTS ====================

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

// ==================== IMAGE GENERATION ====================

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

// ==================== CODE GENERATION ====================

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

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OccuVerse AI is running' });
});

app.listen(PORT, () => {
  console.log(`OccuVerse AI Server running on port ${PORT}`);
});

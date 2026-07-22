# 🚀 OccuVerse AI - All-in-One AI Platform

![GitHub](https://img.shields.io/github/license/jlcv101-netizen/occuverse-ai)
![GitHub last commit](https://img.shields.io/github/last-commit/jlcv101-netizen/occuverse-ai)
![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![React](https://img.shields.io/badge/React-v18+-blue)

> ⭐ A powerful, feature-rich AI platform with chat, weather, jokes, digital clock, and more!

## ✨ Features

### 💬 AI Chat Assistant
- Real-time messaging interface
- Chat history tracking
- Ready for AI API integration
- Responsive design

### 👤 User Profiles
- User authentication (register/login)
- **✅ Profile picture upload (FIXED)**
- Secure password hashing with bcryptjs
- JWT authentication tokens

### 🕐 Global Digital Clock
- Real-time multi-timezone display
- 20+ popular city time zones
- Add/remove custom time zones
- Digital & analog clock visualization
- Smooth animations

### 🌦️ Weather Dashboard
- Real-time weather using Open-Meteo API
- Search weather by city name
- 5-day forecast
- Temperature unit toggle (°C/°F)
- Detailed metrics: humidity, wind, pressure, visibility
- Beautiful weather icons

### 😂 Joke Generator
- Random jokes via Official Joke API
- Multiple categories: random, programming, general, knock-knock
- Beautiful animated display
- No API key required

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Next.js 13** - React framework
- **Axios** - HTTP client
- **Styled JSX** - CSS-in-JS

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Multer** - File upload
- **bcryptjs** - Password hashing
- **JWT** - Authentication

### APIs
- **Open-Meteo** - Weather data (free, no key needed)
- **Official Joke API** - Random jokes (free, no key needed)
- **Geocoding API** - City coordinates (free)

## 📥 Quick Start

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- npm or yarn
- Git (for cloning)

### Installation

```bash
# Clone the repository
git clone https://github.com/jlcv101-netizen/occuverse-ai.git
cd occuverse-ai

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

Then open your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration guide
- **[QUICK_START.md](./QUICK_START.md)** - 3-minute quick start
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Getting started guide
- **[DOWNLOAD_INSTRUCTIONS.md](./DOWNLOAD_INSTRUCTIONS.md)** - Step-by-step installation

## 🎮 How to Use

### Chat Tab
1. Click **💬 Chat**
2. Type a message
3. Click **Send**

### Profile Tab
1. Click **👤 Profile**
2. Click the upload area
3. Select an image
4. Click **Upload Profile Picture**

### Clock Tab
1. Click **🕐 Clock**
2. View current time in multiple zones
3. Click **+ Add Time Zone** to add more cities

### Weather Tab
1. Click **🌦️ Weather**
2. Enter city name
3. Click **🔍 Search**
4. View weather and forecast

### Jokes Tab
1. Click **😂 Jokes**
2. Select category
3. Click **🎲 Get Joke**
4. Enjoy!

## 📁 Project Structure

```
occuverse-ai/
├── server.js                # Backend server
├── package.json            # Dependencies
├── .env.example            # Environment template
├── pages/
│   └── index.jsx          # Main app page
├── components/
│   ├── Chat.jsx
│   ├── ProfileUpload.jsx
│   ├── DigitalClock.jsx
│   ├── WeatherDashboard.jsx
│   └── JokeGenerator.jsx
└── public/
    └── uploads/           # Profile pictures
```

## 🚀 Deployment

### Bolt.new (Recommended)
```bash
git push origin main
# Connect repo to Bolt dashboard
```

### Vercel (Frontend)
1. Create account at [vercel.com](https://vercel.com)
2. Connect GitHub repo
3. Deploy with one click

### Heroku (Backend)
```bash
heroku create
git push heroku main
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register      - Register user
POST /api/auth/login         - Login user
```

### Profile
```
POST /api/profile/upload     - Upload profile picture
GET  /api/profile/:email     - Get user profile
```

### Chat
```
POST /api/chat               - Send message
GET  /api/chat/:userId       - Get chat history
```

### External Data
```
GET  /api/weather?city=London&unit=metric
GET  /api/jokes/random?type=programming
```

## 🔒 Security

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication tokens
- ✅ CORS protection
- ✅ File upload validation
- ✅ Environment variables for secrets

## 🐛 Troubleshooting

### Port already in use
```bash
# Change port in .env
PORT=5001
```

### Module not found
```bash
rm -rf node_modules
npm install
```

### Weather API not working
- Check internet connection
- Open-Meteo requires no API key
- Verify city name spelling

## 📊 Features Comparison

| Feature | Status | API Required |
|---------|--------|-------------|
| Chat | ✅ Ready | No |
| Profile Upload | ✅ Working | No |
| Digital Clock | ✅ Complete | No |
| Weather | ✅ Complete | Open-Meteo (Free) |
| Jokes | ✅ Complete | Official Joke API (Free) |
| Image Generation | 🔜 Coming | Pending |
| Code Generation | 🔜 Coming | Pending |

## 🎯 Roadmap

- [ ] Integrate OpenAI API
- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Real-time notifications
- [ ] Dark mode
- [ ] Mobile app
- [ ] Team collaboration
- [ ] Advanced code execution
- [ ] Analytics dashboard

## 💡 Tips

- Use **Chrome/Firefox** for best compatibility
- Clear browser cache if styling looks odd
- Check browser console (F12) for errors
- Read server logs for API issues

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push and create a Pull Request

## 📄 License

MIT License - Free for personal and commercial use

## 📞 Support

- 📖 [View Full Documentation](./SETUP.md)
- 🐛 [Report Issues](https://github.com/jlcv101-netizen/occuverse-ai/issues)
- 💬 [Discussions](https://github.com/jlcv101-netizen/occuverse-ai/discussions)

## 👨‍💻 Author

**Jhon Lord Visto** - [@jlcv101-netizen](https://github.com/jlcv101-netizen)

---

## 🎉 Get Started Now!

```bash
git clone https://github.com/jlcv101-netizen/occuverse-ai.git
cd occuverse-ai
npm install
npm run dev
```

**Enjoy OccuVerse AI! 🚀**

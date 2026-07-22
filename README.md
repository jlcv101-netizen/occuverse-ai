# 🚀 OccuVerse AI - All-in-One AI Platform

OccuVerse AI is an intelligent platform designed to provide AI-powered assistance through multiple features including chat, content creation, coding, image generation, productivity tools, automation, and business solutions.

## ✨ Features

- 💬 **AI Chat** - Real-time conversation with AI assistant
- 👤 **Profile Management** - User profiles with picture upload (FIXED)
- 🎨 **Image Generation** - Generate images from text descriptions
- 💻 **Code Generation** - Generate and debug code
- 📝 **Content Creation** - Create blog posts, articles, social media content
- 🔐 **Authentication** - Secure user registration and login
- 📊 **Productivity Tools** - Task management and automation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jlcv101-netizen/occuverse-ai.git
cd occuverse-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your settings

### Running the Application

**Development Mode:**
```bash
npm run dev
```

This starts both the backend server (port 5000) and Next.js frontend (port 3000).

**Production Build:**
```bash
npm run build
npm start
```

## 📁 Project Structure

```
occuverse-ai/
├── server.js              # Express backend server
├── pages/                 # Next.js pages
│   └── index.jsx         # Home page
├── components/            # React components
│   ├── Chat.jsx          # Chat interface
│   └── ProfileUpload.jsx  # Profile picture upload
├── public/               # Static files
│   └── uploads/          # Profile pictures storage
├── package.json          # Dependencies
└── .env.example          # Environment template
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `POST /api/profile/upload` - Upload profile picture (FIXED)
- `GET /api/profile/:email` - Get user profile

### Chat
- `POST /api/chat` - Send chat message
- `GET /api/chat/:userId` - Get chat history

### Generation
- `POST /api/generate-image` - Generate image
- `POST /api/generate-code` - Generate code

## 🐛 Bug Fixes

### Profile Picture Upload - FIXED ✅

The profile picture upload feature has been fixed with:
- Proper multer configuration for file uploads
- File validation (image types, size limits)
- Directory creation
- Error handling
- Frontend component with preview

## 🚀 Deployment

### Deploy to Bolt

The project includes `bolt.json` configuration for easy deployment to Bolt:

```bash
git push origin main
```

Then connect your repository to Bolt and deploy!

## 📝 Environment Variables

```
PORT=5000                           # Server port
JWT_SECRET=your-secret-key-here    # JWT signing key
NODE_ENV=development               # Environment
API_BASE_URL=http://localhost:5000 # Backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000 # Public API URL
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Jhon Lord Visto ([@jlcv101-netizen](https://github.com/jlcv101-netizen))

## 🎯 Roadmap

- [ ] Integrate real AI APIs (OpenAI, Anthropic, etc.)
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real-time notifications
- [ ] Advanced image generation
- [ ] Code execution sandbox
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Mobile app

## 📞 Support

For issues and questions, please create an issue on GitHub.

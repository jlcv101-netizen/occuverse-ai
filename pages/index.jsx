import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import ProfileUpload from '../components/ProfileUpload';
import JokeGenerator from '../components/JokeGenerator';
import WeatherDashboard from '../components/WeatherDashboard';
import DigitalClock from '../components/DigitalClock';

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    const mockUser = {
      id: 'user-123',
      email: 'user@example.com',
      username: 'John Doe',
      profilePicture: null
    };
    setUser(mockUser);
  }, []);

  const handleProfileUploadSuccess = (profilePicture) => {
    if (user) {
      setUser({ ...user, profilePicture });
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">🚀 OccuVerse AI</div>
        <div className="user-section">
          {user?.profilePicture && (
            <img src={user.profilePicture} alt="Profile" className="profile-avatar" />
          )}
          <span className="username">{user?.username || 'User'}</span>
        </div>
      </nav>

      <div className="tabs">
        <button className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>💬 Chat</button>
        <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>👤 Profile</button>
        <button className={`tab ${activeTab === 'clock' ? 'active' : ''}`} onClick={() => setActiveTab('clock')}>🕐 Clock</button>
        <button className={`tab ${activeTab === 'weather' ? 'active' : ''}`} onClick={() => setActiveTab('weather')}>🌦️ Weather</button>
        <button className={`tab ${activeTab === 'jokes' ? 'active' : ''}`} onClick={() => setActiveTab('jokes')}>😂 Jokes</button>
        <button className={`tab ${activeTab === 'generate' ? 'active' : ''}`} onClick={() => setActiveTab('generate')}>🎨 Generate</button>
      </div>

      <div className="content">
        {activeTab === 'chat' && user && <Chat userId={user.id} />}
        {activeTab === 'profile' && user && (
          <div className="tab-content">
            <h2>Profile Settings</h2>
            <div className="profile-info">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <ProfileUpload userEmail={user.email} onSuccess={handleProfileUploadSuccess} />
          </div>
        )}
        {activeTab === 'clock' && <DigitalClock />}
        {activeTab === 'weather' && <WeatherDashboard />}
        {activeTab === 'jokes' && <JokeGenerator />}
        {activeTab === 'generate' && (
          <div className="tab-content">
            <h2>🎨 Create Content</h2>
            <p>Image generation, code generation, and more coming soon!</p>
            <div className="feature-coming">✨ Feature Coming Soon</div>
          </div>
        )}
      </div>

      <style jsx>{`
        .home-container { min-height: 100vh; background: #f5f5f5; }
        .navbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .logo { font-size: 28px; font-weight: bold; }
        .user-section { display: flex; align-items: center; gap: 15px; }
        .profile-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid white; }
        .tabs { display: flex; gap: 10px; padding: 20px 40px; background: white; border-bottom: 1px solid #eee; flex-wrap: wrap; overflow-x: auto; }
        .tab { padding: 10px 20px; background: #f0f0f0; border: none; border-radius: 24px; cursor: pointer; transition: all 0.3s; font-size: 14px; font-weight: 500; white-space: nowrap; }
        .tab:hover { background: #e0e0e0; }
        .tab.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .content { padding: 40px; max-width: 1200px; margin: 0 auto; }
        .tab-content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .tab-content h2 { margin-top: 0; color: #333; }
        .profile-info { margin: 20px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .profile-info p { margin: 10px 0; }
        .feature-coming { padding: 40px; text-align: center; color: #999; font-size: 18px; background: #f9f9f9; border-radius: 8px; margin-top: 20px; }
        @media (max-width: 768px) { .navbar { padding: 15px 20px; flex-direction: column; gap: 10px; } .tabs { padding: 15px 20px; } .content { padding: 20px; } .tab-content { padding: 20px; } }
      `}</style>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/chat', { userId, message: input.trim() });
      if (response.data.success) {
        setMessages(response.data.chatHistory);
        setInput('');
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 AI Chat Assistant</h2>
      </div>
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state"><p>Start a conversation with OccuVerse AI</p></div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
              <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-input-form">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." disabled={loading} className="message-input" />
        <button type="submit" disabled={loading || !input.trim()} className="send-button">{loading ? 'Sending...' : 'Send'}</button>
      </form>
      <style jsx>{`
        .chat-container { display: flex; flex-direction: column; height: 100%; max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .chat-header { padding: 20px; border-bottom: 1px solid #eee; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px 8px 0 0; }
        .messages-container { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .empty-state { display: flex; align-items: center; justify-content: center; height: 100%; color: #999; }
        .message { display: flex; flex-direction: column; margin-bottom: 10px; }
        .message.user { align-items: flex-end; }
        .message-content { max-width: 70%; padding: 12px 16px; border-radius: 12px; word-wrap: break-word; }
        .message.user .message-content { background: #667eea; color: white; border-radius: 12px 0 12px 12px; }
        .message.assistant .message-content { background: #f0f0f0; color: #333; border-radius: 0 12px 12px 12px; }
        .message-time { font-size: 12px; color: #999; margin-top: 4px; }
        .message-input-form { display: flex; gap: 10px; padding: 20px; border-top: 1px solid #eee; }
        .message-input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 24px; font-size: 14px; outline: none; }
        .message-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
        .send-button { padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 24px; cursor: pointer; font-weight: 600; }
        .send-button:hover:not(:disabled) { background: #764ba2; }
        .send-button:disabled { background: #ccc; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

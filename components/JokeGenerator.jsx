import React, { useState } from 'react';
import axios from 'axios';

export default function JokeGenerator() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jokeType, setJokeType] = useState('random');

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    setJoke(null);

    try {
      const response = await axios.get('/api/jokes/random', {
        params: { type: jokeType }
      });
      setJoke(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch joke');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="joke-container">
      <div className="joke-header">
        <h2>😂 Random Joke Generator</h2>
        <p>Get a laugh with a random joke!</p>
      </div>

      <div className="joke-controls">
        <div className="type-selector">
          <label htmlFor="joke-type">Joke Type:</label>
          <select 
            id="joke-type"
            value={jokeType} 
            onChange={(e) => setJokeType(e.target.value)}
            disabled={loading}
          >
            <option value="random">Random</option>
            <option value="programming">Programming</option>
            <option value="general">General</option>
            <option value="knock-knock">Knock Knock</option>
          </select>
        </div>
        <button 
          onClick={fetchJoke} 
          disabled={loading}
          className="fetch-button"
        >
          {loading ? '⏳ Loading...' : '🎲 Get Joke'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {joke && (
        <div className="joke-display">
          <div className="joke-content">
            {joke.setup && (
              <>
                <p className="setup">{joke.setup}</p>
                <p className="punchline">{joke.delivery || joke.punchline}</p>
              </>
            )}
            {!joke.setup && (
              <p className="single-line">{joke.value || joke.joke}</p>
            )}
          </div>
          <div className="joke-meta">
            {joke.type && <span className="badge">{joke.type}</span>}
            {joke.category && <span className="badge">{joke.category}</span>}
          </div>
        </div>
      )}

      <style jsx>{`
        .joke-container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .joke-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }

        .joke-header h2 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }

        .joke-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .joke-controls {
          padding: 20px;
          display: flex;
          gap: 10px;
          align-items: flex-end;
          flex-wrap: wrap;
          background: #f9f9f9;
          border-bottom: 1px solid #eee;
        }

        .type-selector {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .type-selector label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        .type-selector select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          background: white;
          transition: border-color 0.3s;
        }

        .type-selector select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .type-selector select:disabled {
          background: #f0f0f0;
          cursor: not-allowed;
        }

        .fetch-button {
          padding: 10px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .fetch-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }

        .fetch-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .fetch-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          padding: 15px 20px;
          background: #ffebee;
          color: #d32f2f;
          border-left: 4px solid #d32f2f;
        }

        .error-message p {
          margin: 0;
          font-size: 14px;
        }

        .joke-display {
          padding: 30px 20px;
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .joke-content {
          margin-bottom: 15px;
        }

        .setup {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #333;
          font-weight: 500;
          line-height: 1.5;
        }

        .punchline {
          margin: 0;
          font-size: 16px;
          color: #667eea;
          font-weight: 600;
          line-height: 1.5;
        }

        .single-line {
          margin: 0;
          font-size: 16px;
          color: #333;
          line-height: 1.6;
        }

        .joke-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: #e8eaf6;
          color: #667eea;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        @media (max-width: 480px) {
          .joke-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .fetch-button {
            width: 100%;
          }

          .joke-header h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('New York');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/weather', {
        params: { city: cityName, unit }
      });
      setWeather(response.data.current);
      setForecast(response.data.forecast || []);
      setCity(cityName);
      setSearchInput('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput);
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    if (weather) {
      fetchWeather(city);
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('storm') || desc.includes('thunder')) return '⛈️';
    if (desc.includes('wind')) return '💨';
    if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="weather-dashboard">
      <div className="weather-header">
        <h1>🌍 Weather Dashboard</h1>
        <p>Get real-time weather information for any city</p>
      </div>

      <div className="weather-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for a city..."
            className="search-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? '⏳ Searching...' : '🔍 Search'}
          </button>
        </form>
        <button onClick={toggleUnit} className="unit-toggle">
          °C / °F
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {weather && (
        <>
          <div className="current-weather">
            <div className="weather-main">
              <div className="weather-icon">
                {getWeatherIcon(weather.description)}
              </div>
              <div className="weather-info">
                <h2>{city}</h2>
                <p className="temperature">
                  {Math.round(weather.temp)}{tempUnit}
                </p>
                <p className="description">{weather.description}</p>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="label">💧 Humidity</span>
                <span className="value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">💨 Wind Speed</span>
                <span className="value">{weather.windSpeed} {windUnit}</span>
              </div>
              <div className="detail-item">
                <span className="label">🔽 Pressure</span>
                <span className="value">{weather.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="label">👁️ Visibility</span>
                <span className="value">{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
              <div className="detail-item">
                <span className="label">🌡️ Feels Like</span>
                <span className="value">{Math.round(weather.feelsLike)}{tempUnit}</span>
              </div>
              <div className="detail-item">
                <span className="label">☁️ Cloudiness</span>
                <span className="value">{weather.clouds}%</span>
              </div>
            </div>
          </div>

          {forecast.length > 0 && (
            <div className="forecast-section">
              <h3>📅 5-Day Forecast</h3>
              <div className="forecast-grid">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <p className="forecast-date">{day.date}</p>
                    <div className="forecast-icon">
                      {getWeatherIcon(day.description)}
                    </div>
                    <div className="forecast-temps">
                      <p className="temp-high">{Math.round(day.tempMax)}{tempUnit}</p>
                      <p className="temp-low">{Math.round(day.tempMin)}{tempUnit}</p>
                    </div>
                    <p className="forecast-desc">{day.description}</p>
                    <div className="forecast-details">
                      <span>💧 {day.humidity}%</span>
                      <span>💨 {day.windSpeed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!weather && !loading && !error && (
        <div className="no-data">
          <p>🔍 Search for a city to see weather information</p>
        </div>
      )}

      <style jsx>{`
        .weather-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .weather-header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }

        .weather-header h1 {
          margin: 0 0 10px 0;
          font-size: 36px;
        }

        .weather-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }

        .weather-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
          flex-wrap: wrap;
        }

        .search-form {
          flex: 1;
          min-width: 250px;
          display: flex;
          gap: 10px;
        }

        .search-input {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: box-shadow 0.3s;
        }

        .search-input:focus {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }

        .search-button {
          padding: 12px 24px;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .search-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .unit-toggle {
          padding: 12px 24px;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .unit-toggle:hover {
          transform: translateY(-2px);
        }

        .error-message {
          max-width: 1000px;
          margin: 0 auto 20px;
          padding: 15px 20px;
          background: #ffebee;
          color: #d32f2f;
          border-radius: 8px;
          border-left: 4px solid #d32f2f;
        }

        .current-weather {
          max-width: 1000px;
          margin: 0 auto 30px;
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .weather-main {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          gap: 30px;
        }

        .weather-icon {
          font-size: 80px;
        }

        .weather-info h2 {
          margin: 0 0 10px 0;
          font-size: 32px;
          color: #333;
        }

        .temperature {
          margin: 0 0 5px 0;
          font-size: 48px;
          font-weight: bold;
          color: #667eea;
        }

        .description {
          margin: 0;
          font-size: 16px;
          color: #666;
          text-transform: capitalize;
        }

        .weather-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .detail-item {
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .detail-item .label {
          font-size: 12px;
          color: #666;
          font-weight: 600;
        }

        .detail-item .value {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .forecast-section {
          max-width: 1000px;
          margin: 0 auto;
        }

        .forecast-section h3 {
          color: white;
          margin: 0 0 20px 0;
          font-size: 24px;
        }

        .forecast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
        }

        .forecast-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .forecast-card:hover {
          transform: translateY(-5px);
        }

        .forecast-date {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        .forecast-icon {
          font-size: 40px;
          margin: 10px 0;
        }

        .forecast-temps {
          margin: 10px 0;
        }

        .temp-high {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
          color: #667eea;
        }

        .temp-low {
          margin: 5px 0 0 0;
          font-size: 14px;
          color: #999;
        }

        .forecast-desc {
          margin: 10px 0;
          font-size: 12px;
          color: #666;
          text-transform: capitalize;
        }

        .forecast-details {
          display: flex;
          justify-content: space-around;
          font-size: 12px;
          color: #999;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }

        .no-data {
          text-align: center;
          color: white;
          padding: 60px 20px;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .weather-header h1 {
            font-size: 28px;
          }

          .weather-controls {
            flex-direction: column;
          }

          .search-form {
            min-width: auto;
          }

          .weather-main {
            flex-direction: column;
            text-align: center;
          }

          .weather-icon {
            font-size: 60px;
          }

          .temperature {
            font-size: 36px;
          }

          .forecast-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

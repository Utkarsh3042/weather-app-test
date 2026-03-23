import { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Wind, Droplets, Thermometer, Cloud } from 'lucide-react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (e) => {
    if (e) e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/weather/${city}`);
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">SkyCast</h1>
      
      <form className="search-container" onSubmit={fetchWeather}>
        <Search size={20} className="search-icon" color="#94a3b8" />
        <input
          type="text"
          className="search-input"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <span className="loader"></span>}

      {error && <div className="error-message">{error}</div>}

      {weather && (
        <div className="weather-card">
          <div className="weather-header">
            <div className="city-info">
              <h2>{weather.city}</h2>
              <p><MapPin size={14} inline style={{verticalAlign: 'middle', marginRight: '4px'}} />{weather.country}</p>
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
              alt={weather.description} 
              width="80"
            />
          </div>

          <div className="temp-display">
            <span className="temperature">{weather.temp}°</span>
            <div className="weather-desc">
              <Cloud size={24} />
              <p style={{textTransform: 'capitalize'}}>{weather.description}</p>
            </div>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <Droplets size={20} color="#38bdf8" />
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weather.humidity}%</span>
            </div>
            <div className="detail-item">
              <Wind size={20} color="#fbbf24" />
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{weather.windSpeed} m/s</span>
            </div>
          </div>
        </div>
      )}

      {!weather && !loading && !error && (
        <div className="weather-card" style={{opacity: 0.6, padding: '1rem'}}>
          <p>Search for a city to see the magic happen ✨</p>
        </div>
      )}
    </div>
  );
}

export default App;

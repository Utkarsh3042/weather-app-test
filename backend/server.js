const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim();

  if (apiKey === 'YOUR_API_KEY_HERE') {
    return res.status(400).json({ error: 'Please provide a valid OpenWeatherMap API key in the backend .env file.' });
  }

  try {
    console.log(`Fetching weather for: ${city}`);
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = response.data;
    
    console.log('Weather response data:', data.weather);
    const weatherInfo = {
      city: data.name,
      temp: Math.round(data.main.temp - 273.15),
      description: data.weather?.[0]?.description || 'No description',
      icon: data.weather?.[0]?.icon || '01d', // Default to clear sky if missing
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      country: data.sys.country
    };

    res.json(weatherInfo);
  } catch (error) {
    if (error.response) {
      console.error(`Error from OpenWeatherMap (${error.response.status}):`, error.response.data.message);
      res.status(error.response.status).json({ error: error.response.data.message });
    } else {
      console.error('Network Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

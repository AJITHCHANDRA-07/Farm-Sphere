import axios from 'axios';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}

class WeatherService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
    
    // Add debug logging
    console.log('🔧 Weather Service initialized');
    console.log('📡 OpenWeatherMap API Key:', this.apiKey ? 'Present' : 'MISSING');
    console.log('🔗 Base URL:', this.baseUrl);
    
    if (!this.apiKey) {
      console.warn('⚠️ OpenWeatherMap API key is missing. Weather functionality will be limited.');
    }
  }

  // Get user's current location using browser geolocation
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get location name
            const response = await axios.get(
              `https://api.openweathermap.org/geo/1.0/reverse`,
              {
                params: {
                  lat: latitude,
                  lon: longitude,
                  limit: 1,
                  appid: this.apiKey
                }
              }
            );

            const location = response.data[0];
            resolve({
              latitude,
              longitude,
              city: location.name || 'Unknown',
              state: location.state || 'Unknown',
              country: location.country || 'Unknown'
            });
          } catch (error) {
            reject(new Error('Failed to get location name'));
          }
        },
        (error) => {
          reject(new Error('Failed to get user location: ' + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Get weather data by coordinates
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      console.log(`🌤️ Fetching weather for coordinates: ${lat}, ${lon}`);
      
      if (!this.apiKey) {
        throw new Error('OpenWeatherMap API key is missing');
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric', // Celsius
          lang: 'en'
        }
      });

      const data = response.data;
      console.log('✅ Weather API response:', data);
      
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: 0 // OpenWeatherMap requires separate API call for UV index
      };
    } catch (error) {
      console.error('❌ Weather API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ API Response:', error.response?.data);
        console.error('❌ API Status:', error.response?.status);
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  // Get weather data by city name
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      console.log(`🌤️ Fetching weather for city: ${city}`);
      
      if (!this.apiKey) {
        throw new Error('OpenWeatherMap API key is missing');
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        }
      });

      const data = response.data;
      console.log('✅ Weather API response for city:', data);
      
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        uvIndex: 0
      };
    } catch (error) {
      console.error('❌ Weather API error for city:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ API Response:', error.response?.data);
        console.error('❌ API Status:', error.response?.status);
      }
      throw new Error('Failed to fetch weather data for city');
    }
  }

  // Get weather with user's current location
  async getCurrentWeather(): Promise<WeatherData> {
    try {
      console.log('🌍 Getting current weather for user location...');
      const location = await this.getCurrentLocation();
      console.log('📍 Location obtained:', location);
      return await this.getWeatherByCoordinates(location.latitude, location.longitude);
    } catch (error) {
      console.warn('⚠️ Geolocation failed, using default location (Delhi):', error);
      // Fallback to a default location if geolocation fails
      return await this.getWeatherByCity('Delhi');
    }
  }

  // Get weather icon URL
  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // Get weather emoji for simple display
  getWeatherEmoji(condition: string): string {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return '☀️';
    } else if (conditionLower.includes('cloud')) {
      return '☁️';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return '🌧️';
    } else if (conditionLower.includes('thunderstorm')) {
      return '⛈️';
    } else if (conditionLower.includes('snow')) {
      return '❄️';
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return '🌫️';
    } else if (conditionLower.includes('wind')) {
      return '💨';
    } else {
      return '🌦️';
    }
  }
}

export const weatherService = new WeatherService();

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Amadeus API configuration for Flights
// Typically requires fetching an auth token first, but for simplicity, we mock the real call if credentials aren't set.
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

// API Configurations
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // For Train/IRCTC
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CALENDARIFIC_API_KEY = process.env.CALENDARIFIC_API_KEY;

let amadeusToken = null;

async function getAmadeusToken() {
    if (amadeusToken) return amadeusToken;
    if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
        throw new Error('Amadeus credentials missing');
    }
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', AMADEUS_API_KEY);
    params.append('client_secret', AMADEUS_API_SECRET);

    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    amadeusToken = response.data.access_token;
    return amadeusToken;
}

// 1. Fetch Flights (Amadeus)
async function fetchFlightData(originIata, destIata, date) {
    try {
        const token = await getAmadeusToken();
        const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                originLocationCode: originIata,
                destinationLocationCode: destIata,
                departureDate: date,
                adults: 1,
                max: 5
            }
        });
        return response.data.data; 
    } catch (error) {
        console.error('Failed to fetch real flight data, falling back to mock:', error.message);
        return null;
    }
}

// 2. Fetch Trains (IRCTC RapidAPI or similar)
async function fetchTrainData(originStation, destStation, date) {
    try {
        if (!RAPIDAPI_KEY) throw new Error('RapidAPI key missing');
        const options = {
            method: 'GET',
            url: 'https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations',
            params: {
                fromStationCode: originStation,
                toStationCode: destStation,
                dateOfJourney: date // YYYY-MM-DD
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch real train data, falling back to mock:', error.message);
        return null;
    }
}

// 3. Fetch Weather (OpenWeather API)
async function fetchWeatherData(city) {
    try {
        if (!OPENWEATHER_API_KEY) throw new Error('OpenWeather API key missing');
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch weather for ${city}, falling back to mock:`, error.message);
        return null;
    }
}

// 4. Fetch Holiday/Festival Data (Calendarific)
async function fetchFestivalData(country = 'IN', year = new Date().getFullYear()) {
    try {
        if (!CALENDARIFIC_API_KEY) throw new Error('Calendarific API key missing');
        const response = await axios.get('https://calendarific.com/api/v2/holidays', {
            params: {
                api_key: CALENDARIFIC_API_KEY,
                country: country,
                year: year,
                type: 'religious,national'
            }
        });
        return response.data.response.holidays;
    } catch (error) {
        console.error('Failed to fetch holidays, falling back to mock:', error.message);
        return null;
    }
}

module.exports = {
    fetchFlightData,
    fetchTrainData,
    fetchWeatherData,
    fetchFestivalData
};

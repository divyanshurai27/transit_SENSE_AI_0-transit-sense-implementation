const express = require('express');
const { fetchFlightData } = require('./services/apiClients');
const { generateDemandForecast, integrateCorridorRisks, enrichPriceHistoryWithTrends } = require('./services/forecastEngine');
const { STORE: recommendationStore } = require('./services/recommendationEngine');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const transportModeTemplates = {
  train: {
    provider: 'Indian Railways',
    minPrice: 2200,
    maxPrice: 3500,
    minDuration: 6,
    maxDuration: 12,
    amenities: ['WiFi', 'Meals', 'Charging Points', 'Blankets'],
    rating: 4.2,
  },
  flight: {
    provider: 'Vistara',
    minPrice: 6500,
    maxPrice: 12000,
    minDuration: 1.5,
    maxDuration: 4,
    amenities: ['In-flight Entertainment', 'Meal', 'Extra Baggage', 'Priority Boarding'],
    rating: 4.5,
  },
  bus: {
    provider: 'RedBus',
    minPrice: 900,
    maxPrice: 2200,
    minDuration: 8,
    maxDuration: 16,
    amenities: ['WiFi', 'Charging Points', 'Water Bottle', 'Blanket'],
    rating: 3.8,
  },
};

function getRouteSeed(origin, destination) {
  const routeString = `${origin.toLowerCase().trim()}-${destination.toLowerCase().trim()}`;
  return [...routeString].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function formatDuration(hours) {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return `${whole}h ${minutes.toString().padStart(2, '0')}m`;
}

function addMinutes(time, minutes) {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date(0, 0, 0, hours, mins + minutes);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function getCrowdLevel(demandScore) {
  if (demandScore >= 80) return 'CRITICAL';
  if (demandScore >= 60) return 'HIGH';
  if (demandScore >= 40) return 'MODERATE';
  return 'LOW';
}

function buildTravelOptions(origin, destination, transportMode = 'all') {
  const seed = getRouteSeed(origin, destination);
  const routeSizeFactor = Math.max(1, Math.min(2.5, 1 + ((seed % 70) / 70)));
  const demandScore = Math.min(100, 40 + (seed % 60));

  const modes = transportMode === 'all'
    ? ['train', 'flight', 'bus']
    : [transportMode];

  return modes.map((mode, index) => {
    const template = transportModeTemplates[mode];
    const priceVariation = Math.floor(template.minPrice + ((seed + index * 17) % (template.maxPrice - template.minPrice)));
    const durationHours = template.minDuration + ((seed + index * 13) % Math.floor(template.maxDuration - template.minDuration + 1));
    const departureBase = ['06:00', '13:00', '20:00'][index % 3];
    const departureTime = departureBase;
    const arrivalTime = addMinutes(departureBase, Math.round(durationHours * 60));

    return {
      id: `${origin}-${destination}-${mode}-${index}`,
      provider: template.provider,
      mode,
      departureTime,
      arrivalTime,
      duration: formatDuration(durationHours),
      price: Math.round(priceVariation * routeSizeFactor),
      availableSeats: Math.max(0, 15 - ((seed + index * 5) % 12)),
      crowdLevel: getCrowdLevel(demandScore + index * 5),
      rating: Number((template.rating + ((seed % 20) / 100)).toFixed(1)),
      amenities: template.amenities,
    };
  });
}

const corridorRisks = [
  {
    origin: 'Mumbai',
    destination: 'Kolkata',
    riskScore: 87,
    transportMode: 'train',
    currentDemand: 1250,
    capacity: 1500,
    incidents: 2,
  },
  {
    origin: 'Delhi',
    destination: 'Varanasi',
    riskScore: 92,
    transportMode: 'bus',
    currentDemand: 890,
    capacity: 950,
    incidents: 1,
  },
  {
    origin: 'Bangalore',
    destination: 'Hyderabad',
    riskScore: 45,
    transportMode: 'flight',
    currentDemand: 320,
    capacity: 800,
    incidents: 0,
  },
  {
    origin: 'Chennai',
    destination: 'Bangalore',
    riskScore: 68,
    transportMode: 'train',
    currentDemand: 780,
    capacity: 1200,
    incidents: 0,
  },
  {
    origin: 'Pune',
    destination: 'Delhi',
    riskScore: 73,
    transportMode: 'flight',
    currentDemand: 450,
    capacity: 600,
    incidents: 1,
  },
];

const festivals = [
  {
    name: 'Diwali',
    dates: 'Oct 31 - Nov 5',
    affectedCorridors: ['Mumbai-Delhi', 'Kolkata-Chennai', 'Bangalore-Hyderabad'],
    historicalCrowdLevel: 92,
    travelTips: 'Book 3 weeks in advance, consider alternate routes, travel during off-peak hours',
    region: 'National',
    expectedTravelers: 45000000,
  },
  {
    name: 'Kumbh Mela',
    dates: 'Jan 14 - Feb 26',
    affectedCorridors: ['Delhi-Prayagraj', 'Mumbai-Prayagraj', 'Kolkata-Prayagraj'],
    historicalCrowdLevel: 98,
    travelTips: 'Expect massive crowds, special trains arranged, book accommodation 6 months ahead',
    region: 'North India',
    expectedTravelers: 100000000,
  },
  {
    name: 'Durga Puja',
    dates: 'Oct 9-13',
    affectedCorridors: ['Kolkata-Mumbai', 'Kolkata-Delhi', 'Kolkata-Bangalore'],
    historicalCrowdLevel: 88,
    travelTips: 'High demand to/from Kolkata, book early morning departures, consider rail over flights',
    region: 'East India',
    expectedTravelers: 25000000,
  },
  {
    name: 'Pongal',
    dates: 'Jan 14-17',
    affectedCorridors: ['Chennai-Bangalore', 'Chennai-Mumbai', 'Chennai-Coimbatore'],
    historicalCrowdLevel: 75,
    travelTips: 'Moderate crowds, book buses in advance, avoid peak travel days',
    region: 'South India',
    expectedTravelers: 15000000,
  },
];

function makeDemandForecast(origin, destination) {
  const forecasts = [];
  const today = new Date();
  const seed = getRouteSeed(origin, destination);
  const routeFactor = 1 + ((seed % 60) / 120);

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.25 : 1.0;
    const baseDemand = 40 + ((seed % 50) * 0.8) + Math.random() * 20;
    const demandScore = Math.min(100, Math.floor(baseDemand * weekendMultiplier * routeFactor));

    let riskLevel = 'LOW';
    if (demandScore >= 80) riskLevel = 'CRITICAL';
    else if (demandScore >= 60) riskLevel = 'HIGH';
    else if (demandScore >= 40) riskLevel = 'MODERATE';

    forecasts.push({
      date,
      demandScore,
      riskLevel,
      expectedPrice: Math.floor(1800 + demandScore * 45 + routeFactor * 120),
      alternativeRoutes: Math.floor(Math.random() * 5) + 1,
    });
  }

  return forecasts;
}

function makeFareAlert(origin, destination) {
  const today = new Date();
  const priceHistory = [];
  const seed = getRouteSeed(origin, destination);
  const basePrice = 2200 + (seed % 500);

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = Math.sin(i / 4) * 400 + (seed % 200) - 100 + Math.random() * 120;
    priceHistory.push({
      date,
      price: Math.max(800, Math.floor(basePrice + variation + (29 - i) * 22)),
    });
  }

  const currentFare = priceHistory[priceHistory.length - 1].price;
  const trend = priceHistory.slice(-3);
  const avgTrend = trend.reduce((sum, item) => sum + item.price, 0) / trend.length;

  let prediction = 'stable';
  if (currentFare > avgTrend * 1.05) prediction = 'increasing';
  else if (currentFare < avgTrend * 0.95) prediction = 'decreasing';

  return {
    route: `${origin} → ${destination}`,
    currentFare,
    baseFare,
    fairPriceCeiling: basePrice * 2,
    priceHistory,
    prediction,
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/search', async (req, res) => {
  const { origin, destination, transportMode = 'all' } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required.' });
  }

  try {
    const options = buildTravelOptions(origin, destination, transportMode);
    
    // Attempt real API fetch
    const todayStr = new Date().toISOString().split('T')[0];
    const originIata = origin.substring(0,3).toUpperCase(); 
    const destIata = destination.substring(0,3).toUpperCase();
    
    if (transportMode === 'all' || transportMode === 'flight') {
        const flightData = await fetchFlightData(originIata, destIata, todayStr);
        if (flightData && flightData.length > 0) {
            const realFlights = flightData.map((f, i) => ({
                id: `real-flight-${i}`,
                provider: f.validatingAirlineCodes?.[0] || 'Airline',
                mode: 'flight',
                departureTime: f.itineraries?.[0]?.segments?.[0]?.departure?.at?.split('T')[1]?.substring(0,5) || '10:00',
                arrivalTime: f.itineraries?.[0]?.segments?.[0]?.arrival?.at?.split('T')[1]?.substring(0,5) || '12:00',
                duration: f.itineraries?.[0]?.duration?.replace('PT', '').toLowerCase() || '2h',
                price: Math.floor(parseFloat(f.price?.total || '0') * 90), 
                availableSeats: f.numberOfBookableSeats || 9,
                crowdLevel: 'MODERATE',
                rating: 4.5,
                amenities: ['In-flight Entertainment', 'Real-time pricing']
            }));
            
            // Filter out mock flights and add real ones
            const nonFlightOptions = options.filter(o => o.mode !== 'flight');
            options.length = 0;
            options.push(...nonFlightOptions, ...realFlights);
        }
    }
    res.json(options);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/demand-forecast', async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required.' });
  }

  try {
      const advancedForecast = await generateDemandForecast(origin, destination);
      res.json(advancedForecast);
  } catch (err) {
      console.error('Demand forecast error:', err);
      res.json(makeDemandForecast(origin, destination)); // Fallback
  }
});

app.get('/api/corridor-risks', async (req, res) => {
  try {
      const integratedRisks = await integrateCorridorRisks(corridorRisks);
      res.json(integratedRisks);
  } catch (err) {
      console.error('Corridor risks error:', err);
      res.json(corridorRisks);
  }
});

app.get('/api/fare-alert', async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required.' });
  }

  try {
      const baseAlert = makeFareAlert(origin, destination);
      const todayStr = new Date().toISOString().split('T')[0];
      const originIata = origin.substring(0,3).toUpperCase();
      const destIata = destination.substring(0,3).toUpperCase();
      
      const flightData = await fetchFlightData(originIata, destIata, todayStr);
      const trends = enrichPriceHistoryWithTrends(origin, destination, baseAlert.priceHistory, flightData, null);
      
      baseAlert.prediction = trends.prediction;
      baseAlert.cheapestDay = trends.cheapestDay;
      baseAlert.priceIncreasePercent = trends.priceIncreasePercent;
      
      if (trends.liveCheapestOverride) {
          baseAlert.currentFare = trends.liveCheapestOverride;
      }
      
      res.json(baseAlert);
  } catch (err) {
      console.error('Fare alert error:', err);
      res.json(makeFareAlert(origin, destination));
  }
});

app.get('/api/festivals', (req, res) => {
  res.json(festivals);
});

app.get('/api/recommendations', async (req, res) => {
  try {
    const list = await recommendationStore.getAll();
    
    // KPI Calculation
    const total = list.length;
    let accepted = 0;
    let underReview = 0;
    let passengersRelieved = 0;
    
    list.forEach(r => {
        if (r.status === 'accepted') {
            accepted++;
            passengersRelieved += r.passengersRelieved;
        } else if (r.status === 'under-review') {
            underReview++;
        }
    });

    res.json({
        recommendations: list,
        kpis: {
            total,
            accepted,
            underReview,
            passengersRelieved
        }
    });
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/recommendations/:id/accept', async (req, res) => {
    try {
        const success = await recommendationStore.updateStatus(req.params.id, 'accepted');
        res.json({ success });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/recommendations/:id/reject', async (req, res) => {
    try {
        const success = await recommendationStore.updateStatus(req.params.id, 'rejected');
        res.json({ success });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/alerts', (req, res) => {
  const { email, route, preferences } = req.body;

  if (!email || !route) {
    return res.status(400).json({ error: 'Email and route are required.' });
  }

  console.log('Alert subscription received:', { email, route, preferences });
  res.json({ success: true, message: 'Subscription created successfully.' });
});

app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});

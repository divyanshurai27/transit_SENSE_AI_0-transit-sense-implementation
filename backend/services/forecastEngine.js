const { fetchWeatherData, fetchFestivalData } = require('./apiClients');

// Utility to get seed for reproducibility in mock logic
function getRouteSeed(origin, destination) {
  const routeString = `${origin.toLowerCase().trim()}-${destination.toLowerCase().trim()}`;
  return [...routeString].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

// 1. Demand Forecast Logic
// Combines historical mock baseline, festival multiplier, and weather impact
async function generateDemandForecast(origin, destination) {
  const forecasts = [];
  const today = new Date();
  const seed = getRouteSeed(origin, destination);
  const routeFactor = 1 + ((seed % 60) / 120);

  // Attempt real API data
  const weatherData = await fetchWeatherData(destination);
  const festivals = await fetchFestivalData() || [];

  const badWeather = weatherData && 
                     weatherData.weather && 
                     ['Thunderstorm', 'Rain', 'Snow', 'Extreme'].includes(weatherData.weather[0].main);
                     
  // A simple 14 day forecast logic
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Festival Multiplier
    let festivalMultiplier = 1.0;
    const isFestival = festivals.find(festival => festival.date && festival.date.iso && festival.date.iso.startsWith(dateStr));
    if (isFestival) {
        festivalMultiplier = 1.30; // +30% demand
    }

    // Weather Impact
    let weatherImpact = 1.0;
    if (badWeather && i < 3) {
        // Bad weather drops demand as people defer travel but increases risk
        weatherImpact = 0.85; 
    }

    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.25 : 1.0;
    
    // Baseline + Modifiers
    const baseDemand = 40 + ((seed % 50) * 0.8) + Math.random() * 20;
    const calculatedDemand = baseDemand * weekendMultiplier * routeFactor * festivalMultiplier * weatherImpact;
    const demandScore = Math.min(100, Math.floor(calculatedDemand));

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
      hasFestival: !!isFestival,
      weatherAlert: (badWeather && i < 3)
    });
  }

  return forecasts;
}

// 2. Risk Score Calculation
// Based on weather severity, congestion, and festival load
async function integrateCorridorRisks(existingRisks) {
    const updatedRisks = [...existingRisks];

    for (let risk of updatedRisks) {
      const destWeather = await fetchWeatherData(risk.destination);
      let riskMultiplier = 1.0;
      
      if (destWeather && destWeather.weather) {
          const condition = destWeather.weather[0].main;
          if (['Thunderstorm', 'Tornado'].includes(condition)) riskMultiplier += 0.4;
          if (['Rain', 'Snow'].includes(condition)) riskMultiplier += 0.2;
      }
      
      risk.riskScore = Math.min(100, Math.floor(risk.riskScore * riskMultiplier));
      
      // Compute Level string
      risk.riskLevel = 'LOW';
      if (risk.riskScore > 85) risk.riskLevel = 'HIGH';
      else if (risk.riskScore > 50) risk.riskLevel = 'MEDIUM';
    }

    return updatedRisks;
}

// 3. Price Trend Enhancement
function enrichPriceHistoryWithTrends(origin, destination, basePriceHistory, liveFlights, liveTrains) {
    // Determine the cheapest day
    let cheapestDay = null;
    let minPrice = Infinity;
    
    basePriceHistory.forEach(history => {
        if (history.price < minPrice) {
            minPrice = history.price;
            cheapestDay = history.date;
        }
    });

    const currentFare = basePriceHistory[basePriceHistory.length - 1].price;
    const trendRange = basePriceHistory.slice(-3);
    const avgTrend = trendRange.reduce((sum, item) => sum + item.price, 0) / trendRange.length;

    let prediction = 'stable';
    if (currentFare > avgTrend * 1.05) prediction = 'increasing';
    else if (currentFare < avgTrend * 0.95) prediction = 'decreasing';
    
    // Real Data Influence
    let liveCheapest = null;
    if (liveFlights && liveFlights.length > 0) {
        liveCheapest = Math.min(...liveFlights.map(f => parseFloat(f.price?.total || '999999')));
    }

    return {
        prediction,
        cheapestDay,
        priceIncreasePercent: ((currentFare - minPrice) / minPrice * 100).toFixed(1),
        liveCheapestOverride: liveCheapest !== null && isFinite(liveCheapest) ? Math.floor(liveCheapest * 90 /* eur to inr roughly */) : null
    };
}

module.exports = {
    generateDemandForecast,
    integrateCorridorRisks,
    enrichPriceHistoryWithTrends,
    getRouteSeed // exported for reuse
};

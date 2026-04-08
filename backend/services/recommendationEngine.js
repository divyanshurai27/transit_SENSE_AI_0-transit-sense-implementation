const { fetchFlightData, fetchWeatherData, fetchFestivalData } = require('./apiClients');

let recommendationCache = null;
let lastCacheTime = null;

// Mock list of corridors to generate recommendations across
const CORRIDORS = [
    { origin: 'BOM', dest: 'DEL', routeName: "Mumbai - Delhi", mode: "Flight", ministry: "Aviation Ministry" },
    { origin: 'DEL', dest: 'VNS', routeName: "Delhi - Varanasi", mode: "Train", ministry: "Railway Ministry" },
    { origin: 'CCU', dest: 'MAA', routeName: "Kolkata - Chennai", mode: "Train", ministry: "Railway Ministry" },
    { origin: 'BLR', dest: 'HYD', routeName: "Bangalore - Hyderabad", mode: "Flight", ministry: "Aviation Ministry" },
    { origin: 'PNQ', dest: 'NAG', routeName: "Pune - Nagpur", mode: "Bus", ministry: "Road Transport Ministry" },
    { origin: 'AMD', dest: 'IXD', routeName: "Ahmedabad - Prayagraj", mode: "Train", ministry: "Railway Ministry" }
];

async function generateRecommendations() {
    const todayStr = new Date().toISOString().split('T')[0];
    const festivals = await fetchFestivalData() || [];
    const newRecs = [];

    for (let i = 0; i < CORRIDORS.length; i++) {
        const c = CORRIDORS[i];
        
        // Parallel data fetch
        const [weather, flights] = await Promise.all([
            fetchWeatherData(c.dest),
            fetchFlightData(c.origin, c.dest, todayStr) // can optionally fetch for train if mode==train
        ]);

        let price = null;
        let availability = null;
        if (flights && flights.length > 0) {
            price = parseFloat(flights[0].price?.total || '0') * 90; // Approx INR
            availability = flights.reduce((sum, f) => sum + (f.numberOfBookableSeats || 0), 0);
        } else {
            // mock fallback
            price = 4500 + Math.random() * 5000;
            availability = Math.floor(Math.random() * 50);
        }

        let isFestivalNearby = false;
        if (festivals.length > 0) {
            // roughly check if there's any festival today or soon
            isFestivalNearby = true; // Simulating match for demonstration
        }

        // Logic
        let demandScore = 0;
        const priceThreshold = 6000;
        const availabilityThreshold = 10;

        if (price > priceThreshold) demandScore += 30;
        if (availability < availabilityThreshold) demandScore += 40;
        if (isFestivalNearby) demandScore += 50;

        let riskLevel = 'LOW';
        let weatherCondition = 'Clear';
        if (weather && weather.weather) {
            weatherCondition = weather.weather[0].main;
            if (['Thunderstorm', 'Rain', 'Snow', 'Extreme'].includes(weatherCondition)) {
                riskLevel = 'HIGH';
            } else if (weatherCondition === 'Clouds') {
                riskLevel = 'MEDIUM';
            }
        }

        let recText = "Monitor capacity";
        let urgency = "low";
        
        if (riskLevel === 'HIGH' && demandScore > 60) {
            urgency = "high";
            recText = `URGENT: Deploy 2 additional ${c.mode}s immediately due to severe ${weatherCondition} and high demand.`;
        } else if (demandScore > 80) {
            urgency = "high";
            recText = `Increase ${c.mode} capacity by 2x due to massive demand surge.`;
        } else if (demandScore > 50) {
            urgency = "medium";
            recText = `Add extra ${c.mode} services to handle elevated loads.`;
        } else {
            recText = `Normal operation suitable. Monitor ${c.mode} throughput.`;
        }

        newRecs.push({
            id: `rec-${Date.now()}-${i}`,
            corridor: c.routeName,
            date: new Date().toISOString(),
            recommendation: recText,
            confidence: Math.min(95, Math.max(70, Math.floor(demandScore))),
            passengersRelieved: Math.floor(demandScore * 10),
            status: "under-review",
            ministry: c.ministry,
            urgency: urgency
        });
    }

    return newRecs;
}

// Memory Store
const STORE = {
    getAll: async function() {
        const now = Date.now();
        // Cache results for 5 minutes
        if (!recommendationCache || !lastCacheTime || now - lastCacheTime > 5 * 60 * 1000) {
            recommendationCache = await generateRecommendations();
            lastCacheTime = now;
        }
        return recommendationCache;
    },
    updateStatus: async function(id, newStatus) {
        if (!recommendationCache) return false;
        const rec = recommendationCache.find(r => r.id === id);
        if (rec) {
            rec.status = newStatus;
            return true;
        }
        return false;
    }
};

module.exports = { STORE };

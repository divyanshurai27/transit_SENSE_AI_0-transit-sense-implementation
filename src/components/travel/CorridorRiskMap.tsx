import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, DivIcon } from 'leaflet';
import { CorridorRisk } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

// Indian city coordinates for realistic mapping
const cityCoordinates: { [key: string]: [number, number] } = {
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.6139, 77.2090],
  'Bangalore': [12.9716, 77.5946],
  'Kolkata': [22.5726, 88.3639],
  'Chennai': [13.0827, 80.2707],
  'Hyderabad': [17.3850, 78.4867],
  'Pune': [18.5204, 73.8567],
  'Ahmedabad': [23.0225, 72.5714],
  'Jaipur': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Kanpur': [26.4499, 80.3319],
  'Nagpur': [21.1458, 79.0882],
  'Indore': [22.7196, 75.8577],
  'Thane': [19.2183, 72.9781],
  'Bhopal': [23.2599, 77.4126],
  'Visakhapatnam': [17.6868, 83.2185],
  'Pimpri-Chinchwad': [18.6298, 73.7997],
  'Patna': [25.5941, 85.1376],
  'Vadodara': [22.3072, 73.1812],
  'Ghaziabad': [28.6692, 77.4538],
  'Ludhiana': [30.9010, 75.8573],
  'Agra': [27.1767, 78.0081],
  'Nashik': [19.9975, 73.7898],
  'Varanasi': [25.3176, 82.9739],
  'Prayagraj': [25.4358, 81.8463]
};

interface CorridorRiskMapProps {
  corridors: CorridorRisk[];
}

const getRiskColor = (riskScore: number) => {
  if (riskScore >= 80) return '#dc2626'; // red-600
  if (riskScore >= 60) return '#ea580c'; // orange-600
  if (riskScore >= 40) return '#f59e0b'; // amber-500
  return '#16a34a'; // green-600
};

const getRiskWeight = (riskScore: number) => {
  if (riskScore >= 80) return 6;
  if (riskScore >= 60) return 5;
  if (riskScore >= 40) return 4;
  return 3;
};

const getTransportIcon = (mode: string) => {
  switch (mode) {
    case 'train':
      return '🚂';
    case 'flight':
      return '✈️';
    case 'bus':
      return '🚌';
    default:
      return '📍';
  }
};

// Custom marker component for cities
const CityMarker = ({ city, riskScore, transportMode }: { city: string; riskScore: number; transportMode: string }) => {
  const coords = cityCoordinates[city];
  if (!coords) return null;

  const riskLevel = riskScore >= 80 ? 'red' : riskScore >= 60 ? 'orange' : riskScore >= 40 ? 'yellow' : 'green';

  const customIcon = new DivIcon({
    html: `
      <div class="relative">
        <div class="absolute -inset-2 bg-${riskLevel}-500 rounded-full opacity-30 animate-pulse"></div>
        <div class="relative bg-white border-2 border-${riskLevel}-500 rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg">
          ${getTransportIcon(transportMode)}
        </div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker position={coords} icon={customIcon}>
      <Popup>
        <div className="text-center">
          <div className="font-semibold">{city}</div>
          <div className="text-sm text-muted-foreground">Risk Score: {riskScore}%</div>
          <Badge variant="outline" className="mt-1 text-xs">
            {transportMode}
          </Badge>
        </div>
      </Popup>
    </Marker>
  );
};

// Map bounds component to auto-fit all markers
const MapBounds = ({ corridors }: { corridors: CorridorRisk[] }) => {
  const map = useMap();
  
  useEffect(() => {
    const bounds: LatLngExpression[] = [];
    
    corridors.forEach(corridor => {
      const originCoords = cityCoordinates[corridor.origin];
      const destCoords = cityCoordinates[corridor.destination];
      if (originCoords) bounds.push(originCoords);
      if (destCoords) bounds.push(destCoords);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, corridors]);

  return null;
};

const CorridorRiskMap = ({ corridors }: CorridorRiskMapProps) => {
  const mapRef = useRef<any>(null);

  // Generate polylines for corridors
  const polylines = corridors.map(corridor => {
    const originCoords = cityCoordinates[corridor.origin];
    const destCoords = cityCoordinates[corridor.destination];
    
    if (!originCoords || !destCoords) return null;

    return {
      positions: [originCoords, destCoords] as LatLngExpression[],
      color: getRiskColor(corridor.riskScore),
      weight: getRiskWeight(corridor.riskScore),
      opacity: 0.7,
      corridor
    };
  }).filter(Boolean);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border relative">
      <MapContainer
        ref={mapRef}
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render corridor lines */}
        {polylines.map((line, index) => (
          line && (
            <Polyline
              key={index}
              positions={line.positions}
              color={line.color}
              weight={line.weight}
              opacity={line.opacity}
            >
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold">
                    {line.corridor.origin} → {line.corridor.destination}
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" style={{ color: line.color }} />
                    <span className="text-sm">Risk Score: {line.corridor.riskScore}%</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mode: {line.corridor.transportMode}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current Demand: {line.corridor.currentDemand}/{line.corridor.capacity}
                  </div>
                  {line.corridor.incidents > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {line.corridor.incidents} incidents
                    </Badge>
                  )}
                </div>
              </Popup>
            </Polyline>
          )
        ))}

        {/* Render city markers */}
        {corridors.map((corridor, index) => (
          <div key={index}>
            <CityMarker 
              city={corridor.origin} 
              riskScore={corridor.riskScore} 
              transportMode={corridor.transportMode}
            />
            <CityMarker 
              city={corridor.destination} 
              riskScore={corridor.riskScore} 
              transportMode={corridor.transportMode}
            />
          </div>
        ))}

        {/* Auto-fit map to show all corridors */}
        <MapBounds corridors={corridors} />
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border z-10">
        <div className="text-sm font-semibold mb-2">Risk Levels</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-600 rounded"></div>
            <span className="text-xs">Low (0-39%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-amber-500 rounded"></div>
            <span className="text-xs">Moderate (40-59%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-600 rounded"></div>
            <span className="text-xs">High (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-600 rounded"></div>
            <span className="text-xs">Critical (80-100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorridorRiskMap;
